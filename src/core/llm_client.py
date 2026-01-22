"""
Azure OpenAI GPT-4o integration for medical reasoning
"""
from typing import List, Dict, Any, Optional
from openai import AzureOpenAI

from src.utils import settings, setup_logger

logger = setup_logger(__name__, settings.log_level)


class MedicalLLM:
    """Azure OpenAI GPT-4o client for medical reasoning"""

    def __init__(self):
        """Initialize Azure OpenAI client"""
        logger.info("Initializing Azure OpenAI client")
        self.client = AzureOpenAI(
            azure_endpoint=settings.azure_openai_endpoint,
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
        )
        self.deployment = settings.azure_openai_deployment
        logger.info(f"LLM client initialized with deployment: {self.deployment}")

    def generate_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        system_prompt: Optional[str] = None,
    ) -> str:
        """
        Generate response using GPT-4o

        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            system_prompt: Optional system prompt override

        Returns:
            Generated response text
        """
        # Prepare messages
        if system_prompt:
            messages = [{"role": "system", "content": system_prompt}] + messages

        try:
            logger.debug(f"Generating response with {len(messages)} messages")
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            generated_text = response.choices[0].message.content
            logger.debug(f"Generated response: {len(generated_text)} characters")
            return generated_text

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise

    def medical_diagnosis_prompt(
        self,
        patient_history: str,
        symptoms: str,
        retrieved_context: List[Dict[str, Any]],
    ) -> str:
        """
        Generate medical diagnosis analysis

        Args:
            patient_history: Patient medical history
            symptoms: Current symptoms description
            retrieved_context: Retrieved medical knowledge from Qdrant

        Returns:
            Diagnosis analysis
        """
        # Format retrieved context
        context_text = "\n\n".join([
            f"**Source {i+1}**: {ctx.get('title', 'Unknown')}\n{ctx.get('content', '')}"
            for i, ctx in enumerate(retrieved_context)
        ])

        system_prompt = """You are an expert medical AI assistant with access to comprehensive medical knowledge.
Your role is to:
1. Analyze patient symptoms and history
2. Consider retrieved medical literature and guidelines
3. Provide evidence-based diagnostic suggestions
4. Highlight important considerations and red flags
5. Recommend appropriate next steps

IMPORTANT: Always cite sources from the retrieved context. Be clear about confidence levels.
This is for educational purposes only - not a replacement for professional medical consultation."""

        user_prompt = f"""**Patient History:**
{patient_history}

**Current Symptoms:**
{symptoms}

**Retrieved Medical Knowledge:**
{context_text}

Based on the patient information and medical knowledge above, please provide:
1. Potential diagnoses (ranked by likelihood)
2. Key supporting evidence from the retrieved context
3. Important differential diagnoses to consider
4. Recommended diagnostic tests or examinations
5. Urgent care considerations (if any)
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        return self.generate_response(messages, temperature=0.3, max_tokens=1500)

    def medical_image_analysis(
        self,
        image_description: str,
        image_type: str,
        retrieved_similar_cases: List[Dict[str, Any]],
    ) -> str:
        """
        Analyze medical image based on description and similar cases

        Args:
            image_description: Description of the medical image
            image_type: Type of medical image (X-ray, MRI, CT, etc.)
            retrieved_similar_cases: Similar cases from Qdrant

        Returns:
            Image analysis
        """
        cases_text = "\n\n".join([
            f"**Similar Case {i+1}**: {case.get('diagnosis', 'Unknown')}\n"
            f"Findings: {case.get('findings', '')}"
            for i, case in enumerate(retrieved_similar_cases)
        ])

        system_prompt = """You are an expert radiologist AI assistant specialized in medical image analysis.
Your role is to:
1. Analyze medical image descriptions
2. Compare with similar cases
3. Identify key findings
4. Suggest potential diagnoses
5. Recommend follow-up imaging or tests

Always provide evidence-based analysis with confidence levels."""

        user_prompt = f"""**Image Type:** {image_type}

**Image Description:**
{image_description}

**Similar Cases:**
{cases_text}

Please provide detailed analysis including:
1. Key radiological findings
2. Comparison with similar cases
3. Potential diagnoses
4. Confidence level and reasoning
5. Recommended follow-up
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        return self.generate_response(messages, temperature=0.2, max_tokens=1200)

    def summarize_patient_session(
        self,
        session_history: List[Dict[str, str]],
    ) -> str:
        """
        Summarize a patient consultation session

        Args:
            session_history: List of conversation messages

        Returns:
            Session summary
        """
        history_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in session_history
        ])

        system_prompt = """You are a medical documentation assistant.
Summarize patient consultation sessions clearly and concisely.
Include: chief complaint, key findings, assessment, and plan."""

        user_prompt = f"""Please summarize the following patient consultation:

{history_text}

Provide a structured summary with:
- Chief Complaint
- History of Present Illness
- Key Findings
- Assessment
- Plan
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        return self.generate_response(messages, temperature=0.1, max_tokens=800)
