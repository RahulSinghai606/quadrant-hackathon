"""
MediVision AI - Gradio Web Interface
Beautiful, professional medical AI assistant UI
"""
import gradio as gr
from typing import List, Tuple, Optional
from pathlib import Path
import json

from src.search import MedicalRAGSystem
from src.utils import settings, setup_logger, demo_data

logger = setup_logger(__name__, settings.log_level)


class MediVisionApp:
    """Gradio application for MediVision AI"""

    def __init__(self):
        """Initialize the application"""
        logger.info("Initializing MediVision AI application")
        self.rag_system = MedicalRAGSystem()
        self._initialize_demo_data()
        logger.info("Application initialized successfully")

    def _initialize_demo_data(self):
        """Load demo medical texts into knowledge base"""
        try:
            logger.info("Loading demo medical texts...")
            medical_texts = demo_data.get_medical_texts()

            for text in medical_texts:
                self.rag_system.index_medical_text(
                    text=text["content"],
                    metadata={
                        "title": text["title"],
                        "category": text["category"],
                        "specialty": text["specialty"],
                        "source": text["source"],
                    },
                )
            logger.info(f"Indexed {len(medical_texts)} medical texts")

        except Exception as e:
            logger.warning(f"Failed to load demo data: {e}")

    def diagnose_symptoms(
        self,
        patient_id: str,
        symptoms: str,
        use_history: bool = True,
    ) -> Tuple[str, str]:
        """
        Diagnose patient symptoms

        Args:
            patient_id: Patient ID
            symptoms: Symptom description
            use_history: Use patient history

        Returns:
            Tuple of (diagnosis, evidence)
        """
        try:
            if not patient_id or not symptoms:
                return "❌ Please provide both Patient ID and symptoms.", ""

            logger.info(f"Processing diagnosis request for patient {patient_id}")

            result = self.rag_system.diagnose_with_context(
                patient_id=patient_id,
                symptoms=symptoms,
                use_patient_history=use_history,
            )

            diagnosis = result["diagnosis"]

            # Format evidence
            evidence_list = result["retrieved_evidence"]
            evidence_text = "## 📚 Retrieved Medical Evidence\n\n"
            for i, evidence in enumerate(evidence_list[:3], 1):
                evidence_text += f"### Source {i}: {evidence.get('title', 'Unknown')}\n"
                evidence_text += f"**Relevance Score:** {evidence.get('relevance_score', 0):.3f}\n\n"
                evidence_text += f"{evidence.get('content', '')[:300]}...\n\n"
                evidence_text += f"---\n\n"

            return diagnosis, evidence_text

        except Exception as e:
            logger.error(f"Error during diagnosis: {e}", exc_info=True)
            return f"❌ Error: {str(e)}", ""

    def search_medical_knowledge(
        self,
        query: str,
        specialty: Optional[str] = None,
    ) -> str:
        """
        Search medical knowledge base

        Args:
            query: Search query
            specialty: Optional specialty filter

        Returns:
            Formatted search results
        """
        try:
            if not query:
                return "❌ Please enter a search query."

            logger.info(f"Searching medical knowledge for: {query}")

            # Build filters
            filters = {"specialty": specialty} if specialty and specialty != "All" else None

            results = self.rag_system.search_medical_texts(
                query=query,
                filters=filters,
                limit=5,
            )

            if not results:
                return "No results found."

            # Format results
            output = f"# 🔍 Search Results for: '{query}'\n\n"
            output += f"Found {len(results)} relevant documents\n\n---\n\n"

            for i, result in enumerate(results, 1):
                output += f"## {i}. {result.get('title', 'Unknown')}\n\n"
                output += f"**Specialty:** {result.get('specialty', 'N/A')} | "
                output += f"**Category:** {result.get('category', 'N/A')} | "
                output += f"**Relevance:** {result.get('relevance_score', 0):.3f}\n\n"
                output += f"{result.get('content', '')}\n\n"
                output += f"*Source: {result.get('source', 'Unknown')}*\n\n"
                output += "---\n\n"

            return output

        except Exception as e:
            logger.error(f"Error during search: {e}", exc_info=True)
            return f"❌ Error: {str(e)}"

    def get_patient_summary(self, patient_id: str) -> str:
        """
        Get patient medical history summary

        Args:
            patient_id: Patient ID

        Returns:
            Formatted patient summary
        """
        try:
            if not patient_id:
                return "❌ Please provide a Patient ID."

            logger.info(f"Retrieving summary for patient {patient_id}")

            summary = self.rag_system.memory_manager.get_patient_summary(patient_id)

            if summary["total_interactions"] == 0:
                return f"# Patient {patient_id}\n\nNo medical history found."

            output = f"# 👤 Patient Medical Summary\n\n"
            output += f"**Patient ID:** {summary['patient_id']}\n\n"
            output += f"**Total Interactions:** {summary['total_interactions']}\n\n"
            output += f"**First Visit:** {summary.get('first_visit', 'N/A')}\n\n"
            output += f"**Last Visit:** {summary.get('last_visit', 'N/A')}\n\n"

            output += f"### Interaction Breakdown\n\n"
            for itype, count in summary["interaction_types"].items():
                output += f"- **{itype.replace('_', ' ').title()}:** {count}\n"

            output += f"\n### Recent Interactions\n\n"
            for i, interaction in enumerate(summary["recent_interactions"], 1):
                output += f"#### {i}. {interaction.get('type', 'Unknown').replace('_', ' ').title()}\n"
                output += f"**Date:** {interaction.get('timestamp', 'N/A')}\n\n"
                output += f"{interaction.get('content', '')[:200]}...\n\n"
                output += "---\n\n"

            return output

        except Exception as e:
            logger.error(f"Error retrieving patient summary: {e}", exc_info=True)
            return f"❌ Error: {str(e)}"

    def get_treatment_recommendations(
        self,
        patient_id: str,
        diagnosis: str,
        contraindications: str = "",
    ) -> str:
        """
        Get treatment recommendations

        Args:
            patient_id: Patient ID
            diagnosis: Confirmed diagnosis
            contraindications: Known contraindications

        Returns:
            Treatment recommendations
        """
        try:
            if not patient_id or not diagnosis:
                return "❌ Please provide both Patient ID and diagnosis."

            logger.info(f"Generating treatment recommendations for patient {patient_id}")

            contraindications_list = [c.strip() for c in contraindications.split(",")] if contraindications else None

            result = self.rag_system.recommend_treatment(
                patient_id=patient_id,
                diagnosis=diagnosis,
                contraindications=contraindications_list,
            )

            output = f"# 💊 Treatment Recommendations\n\n"
            output += f"**Patient ID:** {patient_id}\n"
            output += f"**Diagnosis:** {diagnosis}\n\n"
            output += "---\n\n"
            output += result["recommendations"]

            return output

        except Exception as e:
            logger.error(f"Error generating recommendations: {e}", exc_info=True)
            return f"❌ Error: {str(e)}"

    def load_demo_scenario(self, scenario_id: str) -> Tuple[str, str]:
        """
        Load a demo symptom scenario

        Args:
            scenario_id: Scenario identifier

        Returns:
            Tuple of (patient_id, symptoms)
        """
        scenarios = demo_data.get_demo_symptoms()
        for scenario in scenarios:
            if scenario["id"] == scenario_id:
                # Use a consistent demo patient ID
                return "DEMO_P001", scenario["description"]
        return "", ""

    def create_interface(self) -> gr.Blocks:
        """Create Gradio interface"""

        # Custom CSS for professional medical UI
        custom_css = """
        .gradio-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1400px;
            margin: auto;
        }
        .gr-button-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-weight: 600;
        }
        .gr-button-secondary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border: none;
            color: white;
            font-weight: 600;
        }
        .header {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        .markdown-text {
            line-height: 1.6;
        }
        """

        with gr.Blocks(css=custom_css, title="MediVision AI", theme=gr.themes.Soft()) as interface:

            gr.HTML("""
                <div class="header">
                    <h1>🏥 MediVision AI</h1>
                    <p style="font-size: 1.2rem; margin-top: 1rem;">
                        Advanced Healthcare Memory Assistant with Multimodal Medical Intelligence
                    </p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.9;">
                        Powered by Qdrant Vector Search • Azure GPT-4o • RAG Technology
                    </p>
                </div>
            """)

            with gr.Tabs():

                # Tab 1: Medical Diagnosis
                with gr.Tab("🩺 Medical Diagnosis"):
                    gr.Markdown("## AI-Powered Diagnosis with Evidence Retrieval")
                    gr.Markdown("Analyze symptoms with long-term patient memory and retrieved medical knowledge.")

                    with gr.Row():
                        with gr.Column(scale=1):
                            diag_patient_id = gr.Textbox(
                                label="Patient ID",
                                placeholder="Enter patient identifier (e.g., P001)",
                                value="DEMO_P001",
                            )
                            diag_symptoms = gr.Textbox(
                                label="Symptoms Description",
                                placeholder="Describe patient symptoms in detail...",
                                lines=6,
                            )
                            diag_use_history = gr.Checkbox(
                                label="Use Patient History",
                                value=True,
                                info="Include patient's past medical records in analysis",
                            )

                            gr.Markdown("### 📋 Quick Load Demo Scenarios")
                            demo_scenario = gr.Radio(
                                choices=["S001", "S002", "S003"],
                                label="Select Demo Scenario",
                                info="S001: Pneumonia | S002: Migraine | S003: Diabetes",
                            )

                            with gr.Row():
                                load_demo_btn = gr.Button("Load Demo", variant="secondary")
                                diagnose_btn = gr.Button("🔍 Diagnose", variant="primary", size="lg")

                        with gr.Column(scale=1):
                            diagnosis_output = gr.Markdown(label="Diagnosis", elem_classes=["markdown-text"])

                    evidence_output = gr.Markdown(label="Retrieved Evidence", elem_classes=["markdown-text"])

                    # Wire up demo scenario loader
                    load_demo_btn.click(
                        fn=self.load_demo_scenario,
                        inputs=[demo_scenario],
                        outputs=[diag_patient_id, diag_symptoms],
                    )

                    # Wire up diagnosis
                    diagnose_btn.click(
                        fn=self.diagnose_symptoms,
                        inputs=[diag_patient_id, diag_symptoms, diag_use_history],
                        outputs=[diagnosis_output, evidence_output],
                    )

                # Tab 2: Medical Knowledge Search
                with gr.Tab("📚 Knowledge Search"):
                    gr.Markdown("## Search Medical Knowledge Base")
                    gr.Markdown("Semantic search across medical literature, guidelines, and research.")

                    with gr.Row():
                        with gr.Column(scale=2):
                            search_query = gr.Textbox(
                                label="Search Query",
                                placeholder="Enter medical condition, symptoms, or treatment...",
                                lines=2,
                            )
                        with gr.Column(scale=1):
                            search_specialty = gr.Dropdown(
                                choices=["All", "cardiology", "pulmonology", "endocrinology", "neurology", "infectious disease"],
                                label="Specialty Filter",
                                value="All",
                            )

                    search_btn = gr.Button("🔍 Search", variant="primary")
                    search_output = gr.Markdown(label="Search Results", elem_classes=["markdown-text"])

                    search_btn.click(
                        fn=self.search_medical_knowledge,
                        inputs=[search_query, search_specialty],
                        outputs=[search_output],
                    )

                # Tab 3: Patient Memory
                with gr.Tab("👤 Patient Memory"):
                    gr.Markdown("## Patient Medical History & Memory")
                    gr.Markdown("Access comprehensive patient history with long-term memory tracking.")

                    with gr.Row():
                        with gr.Column():
                            memory_patient_id = gr.Textbox(
                                label="Patient ID",
                                placeholder="Enter patient identifier",
                                value="DEMO_P001",
                            )
                            get_summary_btn = gr.Button("📊 Get Patient Summary", variant="primary")

                    patient_summary_output = gr.Markdown(label="Patient Summary", elem_classes=["markdown-text"])

                    get_summary_btn.click(
                        fn=self.get_patient_summary,
                        inputs=[memory_patient_id],
                        outputs=[patient_summary_output],
                    )

                # Tab 4: Treatment Recommendations
                with gr.Tab("💊 Treatment Recommendations"):
                    gr.Markdown("## Evidence-Based Treatment Recommendations")
                    gr.Markdown("Generate personalized treatment plans based on diagnosis and patient history.")

                    with gr.Row():
                        with gr.Column():
                            treat_patient_id = gr.Textbox(
                                label="Patient ID",
                                placeholder="Enter patient identifier",
                                value="DEMO_P001",
                            )
                            treat_diagnosis = gr.Textbox(
                                label="Confirmed Diagnosis",
                                placeholder="Enter confirmed diagnosis",
                            )
                            treat_contraindications = gr.Textbox(
                                label="Known Contraindications (optional)",
                                placeholder="Enter allergies or contraindications, separated by commas",
                            )
                            recommend_btn = gr.Button("💊 Get Recommendations", variant="primary")

                    treatment_output = gr.Markdown(label="Treatment Recommendations", elem_classes=["markdown-text"])

                    recommend_btn.click(
                        fn=self.get_treatment_recommendations,
                        inputs=[treat_patient_id, treat_diagnosis, treat_contraindications],
                        outputs=[treatment_output],
                    )

                # Tab 5: System Info
                with gr.Tab("ℹ️ System Information"):
                    gr.Markdown("""
                    ## 🏥 MediVision AI - System Information

                    ### Core Capabilities
                    - **🔍 Multimodal Search**: Semantic search across text and medical images
                    - **🧠 Long-term Memory**: Persistent patient history with evolving knowledge
                    - **💡 Evidence-Based Diagnosis**: RAG-powered diagnosis with source citation
                    - **💊 Treatment Recommendations**: Personalized treatment plans
                    - **📊 Patient Tracking**: Comprehensive medical history management

                    ### Technology Stack
                    - **Vector Search Engine**: Qdrant (production-grade similarity search)
                    - **Large Language Model**: Azure OpenAI GPT-4o
                    - **Embeddings**:
                        - Text: Sentence Transformers (all-MiniLM-L6-v2)
                        - Medical Text: BioBERT (BiomedNLP-BiomedBERT)
                        - Images: ResNet-50 (Microsoft)
                    - **Architecture**: RAG (Retrieval-Augmented Generation)

                    ### Societal Impact
                    **Healthcare Access & Quality**
                    - Assists healthcare providers with evidence-based decision support
                    - Maintains comprehensive patient history for continuity of care
                    - Democratizes access to medical knowledge in underserved areas
                    - Reduces diagnostic errors through systematic retrieval

                    ### Safety & Ethics
                    - All recommendations are evidence-based and cite sources
                    - System highlights confidence levels and uncertainties
                    - Designed as a clinical decision support tool (not autonomous diagnosis)
                    - Emphasizes professional medical consultation requirement

                    ### Collections
                    """)

                    try:
                        collections = self.rag_system.qdrant.list_collections()
                        collections_text = "\n".join([f"- `{col}`" for col in collections])
                        gr.Markdown(f"**Active Qdrant Collections:**\n{collections_text}")
                    except:
                        gr.Markdown("*Qdrant connection information unavailable*")

                    gr.Markdown("""
                    ---
                    **Developed for Convolve 4.0 - Pan-IIT AI/ML Hackathon**

                    *This system demonstrates the power of vector search, long-term memory,
                    and multimodal AI for addressing healthcare challenges.*
                    """)

            gr.HTML("""
                <div style="text-align: center; margin-top: 2rem; padding: 1rem; opacity: 0.7;">
                    <p>⚠️ <strong>Important:</strong> This is an AI-powered clinical decision support tool for educational purposes.
                    Always consult qualified healthcare professionals for medical diagnosis and treatment.</p>
                </div>
            """)

        return interface


def launch_app():
    """Launch the Gradio application"""
    app = MediVisionApp()
    interface = app.create_interface()

    logger.info("Launching MediVision AI interface")
    interface.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True,
    )


if __name__ == "__main__":
    launch_app()
