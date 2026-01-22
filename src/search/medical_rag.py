"""
Retrieval-Augmented Generation system for medical knowledge
"""
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import json

from src.core import QdrantManager, MedicalLLM
from src.embeddings import TextEmbedder, MedicalTextEmbedder, MedicalImageEmbedder
from src.memory import PatientMemoryManager
from src.utils import settings, setup_logger

logger = setup_logger(__name__, settings.log_level)


class MedicalRAGSystem:
    """
    Retrieval-Augmented Generation system for medical diagnosis and recommendations
    """

    def __init__(self):
        """Initialize Medical RAG system"""
        logger.info("Initializing Medical RAG system")

        # Initialize components
        self.qdrant = QdrantManager()
        self.llm = MedicalLLM()
        self.text_embedder = TextEmbedder()
        self.medical_text_embedder = MedicalTextEmbedder()
        self.image_embedder = MedicalImageEmbedder()
        self.memory_manager = PatientMemoryManager()

        # Collection names
        self.texts_collection = settings.medical_texts_collection
        self.images_collection = settings.medical_images_collection

        # Create collections
        self._initialize_collections()

        logger.info("Medical RAG system initialized successfully")

    def _initialize_collections(self) -> None:
        """Initialize Qdrant collections"""
        # Medical texts collection
        self.qdrant.create_collection(
            collection_name=self.texts_collection,
            vector_size=self.medical_text_embedder.dimension,
        )

        # Medical images collection
        self.qdrant.create_collection(
            collection_name=self.images_collection,
            vector_size=self.image_embedder.dimension,
        )

        logger.info("Qdrant collections initialized")

    def index_medical_text(
        self,
        text: str,
        metadata: Dict[str, Any],
    ) -> str:
        """
        Index medical text document

        Args:
            text: Medical text content
            metadata: Document metadata (title, source, category, etc.)

        Returns:
            Document ID
        """
        # Generate embedding
        embedding = self.medical_text_embedder.embed(text)[0].tolist()

        # Store in Qdrant
        ids = self.qdrant.upsert_points(
            collection_name=self.texts_collection,
            vectors=[embedding],
            payloads=[{
                "content": text,
                **metadata,
            }],
        )

        logger.info(f"Indexed medical text: {metadata.get('title', 'Unknown')}")
        return ids[0]

    def index_medical_image(
        self,
        image_path: str,
        metadata: Dict[str, Any],
    ) -> str:
        """
        Index medical image

        Args:
            image_path: Path to medical image
            metadata: Image metadata (diagnosis, modality, body_part, etc.)

        Returns:
            Image ID
        """
        # Generate embedding
        embedding = self.image_embedder.embed(image_path)[0].tolist()

        # Store in Qdrant
        ids = self.qdrant.upsert_points(
            collection_name=self.images_collection,
            vectors=[embedding],
            payloads=[{
                "image_path": str(image_path),
                **metadata,
            }],
        )

        logger.info(f"Indexed medical image: {metadata.get('modality', 'Unknown')}")
        return ids[0]

    def search_medical_texts(
        self,
        query: str,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Search medical text knowledge base

        Args:
            query: Search query
            filters: Optional metadata filters
            limit: Number of results

        Returns:
            Retrieved medical texts with relevance scores
        """
        # Generate query embedding
        query_embedding = self.medical_text_embedder.embed(query)[0].tolist()

        # Search
        if filters:
            results = self.qdrant.hybrid_search(
                collection_name=self.texts_collection,
                query_vector=query_embedding,
                metadata_filters=filters,
                limit=limit,
            )
        else:
            results = self.qdrant.search(
                collection_name=self.texts_collection,
                query_vector=query_embedding,
                limit=limit,
            )

        # Format results
        retrieved = [
            {
                **point.payload,
                "relevance_score": point.score,
            }
            for point in results
        ]

        logger.debug(f"Retrieved {len(retrieved)} medical texts for query: {query[:50]}...")
        return retrieved

    def search_similar_images(
        self,
        image_path: str,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Search for similar medical images

        Args:
            image_path: Path to query image
            filters: Optional metadata filters
            limit: Number of results

        Returns:
            Similar images with metadata
        """
        # Generate query embedding
        query_embedding = self.image_embedder.embed(image_path)[0].tolist()

        # Search
        if filters:
            results = self.qdrant.hybrid_search(
                collection_name=self.images_collection,
                query_vector=query_embedding,
                metadata_filters=filters,
                limit=limit,
            )
        else:
            results = self.qdrant.search(
                collection_name=self.images_collection,
                query_vector=query_embedding,
                limit=limit,
            )

        # Format results
        similar_images = [
            {
                **point.payload,
                "similarity_score": point.score,
            }
            for point in results
        ]

        logger.debug(f"Found {len(similar_images)} similar medical images")
        return similar_images

    def diagnose_with_context(
        self,
        patient_id: str,
        symptoms: str,
        use_patient_history: bool = True,
    ) -> Dict[str, Any]:
        """
        Perform diagnosis with retrieved context

        Args:
            patient_id: Patient identifier
            symptoms: Current symptoms description
            use_patient_history: Whether to use patient's historical data

        Returns:
            Diagnosis with retrieved evidence
        """
        logger.info(f"Diagnosing patient {patient_id}")

        # Retrieve patient history if requested
        patient_history = ""
        if use_patient_history:
            history = self.memory_manager.retrieve_patient_history(patient_id, limit=5)
            if history:
                patient_history = "\n".join([
                    f"- {h.get('timestamp')}: {h.get('content', '')[:100]}..."
                    for h in history
                ])
            else:
                patient_history = "No previous history available."

        # Search relevant medical knowledge
        query = f"symptoms: {symptoms}"
        relevant_texts = self.search_medical_texts(query, limit=5)

        # Generate diagnosis using LLM
        diagnosis = self.llm.medical_diagnosis_prompt(
            patient_history=patient_history,
            symptoms=symptoms,
            retrieved_context=relevant_texts,
        )

        # Store this interaction in memory
        self.memory_manager.store_interaction(
            patient_id=patient_id,
            interaction_type="diagnosis",
            content=f"Symptoms: {symptoms}\n\nDiagnosis: {diagnosis}",
            metadata={"symptoms": symptoms},
        )

        result = {
            "patient_id": patient_id,
            "diagnosis": diagnosis,
            "retrieved_evidence": relevant_texts,
            "patient_history_used": bool(patient_history),
        }

        return result

    def analyze_medical_image_with_rag(
        self,
        patient_id: str,
        image_path: str,
        image_type: str,
        description: str,
    ) -> Dict[str, Any]:
        """
        Analyze medical image with similar case retrieval

        Args:
            patient_id: Patient identifier
            image_path: Path to medical image
            image_type: Type of image (X-ray, MRI, CT, etc.)
            description: Image description

        Returns:
            Analysis with similar cases
        """
        logger.info(f"Analyzing medical image for patient {patient_id}")

        # Find similar images
        similar_cases = self.search_similar_images(
            image_path=image_path,
            filters={"modality": image_type},
            limit=5,
        )

        # Generate analysis using LLM
        analysis = self.llm.medical_image_analysis(
            image_description=description,
            image_type=image_type,
            retrieved_similar_cases=similar_cases,
        )

        # Store interaction
        self.memory_manager.store_interaction(
            patient_id=patient_id,
            interaction_type="image_analysis",
            content=f"Image Type: {image_type}\nDescription: {description}\n\nAnalysis: {analysis}",
            metadata={"image_type": image_type, "image_path": str(image_path)},
        )

        result = {
            "patient_id": patient_id,
            "image_analysis": analysis,
            "similar_cases": similar_cases,
        }

        return result

    def recommend_treatment(
        self,
        patient_id: str,
        diagnosis: str,
        contraindications: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Recommend treatment options based on diagnosis

        Args:
            patient_id: Patient identifier
            diagnosis: Confirmed diagnosis
            contraindications: Known contraindications or allergies

        Returns:
            Treatment recommendations
        """
        logger.info(f"Generating treatment recommendations for patient {patient_id}")

        # Search treatment literature
        query = f"treatment guidelines for {diagnosis}"
        treatment_guidelines = self.search_medical_texts(
            query=query,
            filters={"category": "treatment"},
            limit=5,
        )

        # Get patient history for personalization
        patient_history = self.memory_manager.retrieve_patient_history(patient_id, limit=10)

        # Build context for LLM
        context_text = "\n\n".join([
            f"**Guideline {i+1}**: {guide.get('title', 'Unknown')}\n{guide.get('content', '')}"
            for i, guide in enumerate(treatment_guidelines)
        ])

        history_text = "\n".join([
            f"- {h.get('timestamp')}: {h.get('type')} - {h.get('content', '')[:100]}"
            for h in patient_history[:5]
        ])

        contraindications_text = ", ".join(contraindications) if contraindications else "None known"

        # Generate recommendations
        prompt = f"""**Diagnosis:** {diagnosis}

**Patient History:**
{history_text}

**Known Contraindications:** {contraindications_text}

**Treatment Guidelines:**
{context_text}

Based on the diagnosis, patient history, and treatment guidelines above, please provide:
1. Recommended treatment options (ranked by effectiveness and patient suitability)
2. Considerations for this specific patient
3. Potential side effects or risks
4. Monitoring recommendations
5. Alternative approaches if first-line treatment fails
"""

        messages = [
            {"role": "system", "content": "You are an expert medical AI assistant providing evidence-based treatment recommendations."},
            {"role": "user", "content": prompt},
        ]

        recommendations = self.llm.generate_response(messages, temperature=0.2, max_tokens=1500)

        # Store interaction
        self.memory_manager.store_interaction(
            patient_id=patient_id,
            interaction_type="treatment_recommendation",
            content=f"Diagnosis: {diagnosis}\n\nRecommendations: {recommendations}",
            metadata={"diagnosis": diagnosis},
        )

        result = {
            "patient_id": patient_id,
            "recommendations": recommendations,
            "evidence_sources": treatment_guidelines,
        }

        return result
