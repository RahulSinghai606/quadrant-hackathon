"""
Patient memory management with long-term context tracking
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import uuid4
import json

from src.core import QdrantManager
from src.embeddings import TextEmbedder
from src.utils import settings, setup_logger

logger = setup_logger(__name__, settings.log_level)


class PatientMemoryManager:
    """Manage long-term patient memory and interaction history"""

    def __init__(self):
        """Initialize patient memory manager"""
        self.qdrant = QdrantManager()
        self.text_embedder = TextEmbedder()
        self.collection_name = settings.patient_memory_collection

        # Create collection if not exists
        self.qdrant.create_collection(
            collection_name=self.collection_name,
            vector_size=self.text_embedder.dimension,
        )
        logger.info("Patient memory manager initialized")

    def store_interaction(
        self,
        patient_id: str,
        interaction_type: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Store a patient interaction in memory

        Args:
            patient_id: Unique patient identifier
            interaction_type: Type of interaction (consultation, diagnosis, image_analysis, etc.)
            content: Content of the interaction
            metadata: Additional metadata

        Returns:
            Interaction ID
        """
        interaction_id = str(uuid4())
        timestamp = datetime.now().isoformat()

        # Generate embedding
        embedding = self.text_embedder.embed(content)[0].tolist()

        # Prepare payload
        payload = {
            "interaction_id": interaction_id,
            "patient_id": patient_id,
            "type": interaction_type,
            "content": content,
            "timestamp": timestamp,
            **(metadata or {}),
        }

        # Store in Qdrant
        self.qdrant.upsert_points(
            collection_name=self.collection_name,
            vectors=[embedding],
            payloads=[payload],
            ids=[interaction_id],
        )

        logger.info(f"Stored interaction {interaction_id} for patient {patient_id}")
        return interaction_id

    def retrieve_patient_history(
        self,
        patient_id: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve patient's interaction history

        Args:
            patient_id: Patient identifier
            limit: Maximum number of interactions to retrieve

        Returns:
            List of interactions sorted by timestamp
        """
        # Use dummy vector for filtering-only search
        dummy_vector = [0.0] * self.text_embedder.dimension

        results = self.qdrant.hybrid_search(
            collection_name=self.collection_name,
            query_vector=dummy_vector,
            metadata_filters={"patient_id": patient_id},
            limit=limit,
        )

        # Extract and sort by timestamp
        interactions = [point.payload for point in results]
        interactions.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

        logger.debug(f"Retrieved {len(interactions)} interactions for patient {patient_id}")
        return interactions

    def semantic_memory_search(
        self,
        patient_id: str,
        query: str,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Search patient memory semantically

        Args:
            patient_id: Patient identifier
            query: Search query
            limit: Number of results

        Returns:
            Relevant past interactions
        """
        # Generate query embedding
        query_embedding = self.text_embedder.embed(query)[0].tolist()

        # Search with patient filter
        results = self.qdrant.hybrid_search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            metadata_filters={"patient_id": patient_id},
            limit=limit,
        )

        interactions = [
            {
                **point.payload,
                "relevance_score": point.score,
            }
            for point in results
        ]

        logger.debug(f"Found {len(interactions)} relevant memories for query: {query[:50]}...")
        return interactions

    def get_patient_summary(self, patient_id: str) -> Dict[str, Any]:
        """
        Get summary of patient's medical history

        Args:
            patient_id: Patient identifier

        Returns:
            Patient summary with statistics
        """
        history = self.retrieve_patient_history(patient_id, limit=100)

        # Calculate statistics
        interaction_types = {}
        for interaction in history:
            itype = interaction.get("type", "unknown")
            interaction_types[itype] = interaction_types.get(itype, 0) + 1

        summary = {
            "patient_id": patient_id,
            "total_interactions": len(history),
            "interaction_types": interaction_types,
            "first_visit": history[-1].get("timestamp") if history else None,
            "last_visit": history[0].get("timestamp") if history else None,
            "recent_interactions": history[:5],
        }

        return summary

    def update_interaction(
        self,
        interaction_id: str,
        updates: Dict[str, Any],
    ) -> None:
        """
        Update an existing interaction

        Args:
            interaction_id: Interaction ID to update
            updates: Dictionary of fields to update
        """
        # Retrieve existing point
        results = self.qdrant.search(
            collection_name=self.collection_name,
            query_vector=[0.0] * self.text_embedder.dimension,
            limit=1,
        )

        if not results:
            logger.warning(f"Interaction {interaction_id} not found")
            return

        # Merge updates with existing payload
        existing_payload = results[0].payload
        updated_payload = {**existing_payload, **updates}

        # Re-embed if content changed
        if "content" in updates:
            embedding = self.text_embedder.embed(updates["content"])[0].tolist()
        else:
            # Keep existing embedding
            embedding = results[0].vector

        # Update in Qdrant
        self.qdrant.upsert_points(
            collection_name=self.collection_name,
            vectors=[embedding],
            payloads=[updated_payload],
            ids=[interaction_id],
        )

        logger.info(f"Updated interaction {interaction_id}")
