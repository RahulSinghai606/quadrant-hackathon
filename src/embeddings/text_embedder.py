"""
Text embedding generation for medical documents
"""
from typing import List, Union
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModel
import torch

from src.utils import settings, setup_logger

logger = setup_logger(__name__, settings.log_level)


class TextEmbedder:
    """Generate embeddings for text using Sentence Transformers"""

    def __init__(self, model_name: str = None):
        """
        Initialize text embedder

        Args:
            model_name: Model name for embedding generation
        """
        self.model_name = model_name or settings.text_embedding_model
        logger.info(f"Loading text embedding model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()
        logger.info(f"Text embedder initialized with dimension: {self.dimension}")

    def embed(self, texts: Union[str, List[str]]) -> np.ndarray:
        """
        Generate embeddings for text(s)

        Args:
            texts: Single text or list of texts

        Returns:
            Embedding array of shape (n_texts, dimension)
        """
        if isinstance(texts, str):
            texts = [texts]

        logger.debug(f"Generating embeddings for {len(texts)} texts")
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=False
        )
        return embeddings


class MedicalTextEmbedder:
    """Generate embeddings for medical text using BioBERT"""

    def __init__(self, model_name: str = None):
        """
        Initialize medical text embedder

        Args:
            model_name: Model name for medical text embedding
        """
        self.model_name = model_name or settings.medical_text_model
        logger.info(f"Loading medical text embedding model: {self.model_name}")

        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name)
        self.model.eval()
        self.dimension = settings.medical_text_embedding_dim

        # Move to GPU if available
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        logger.info(f"Medical text embedder initialized on {self.device}")

    def embed(self, texts: Union[str, List[str]]) -> np.ndarray:
        """
        Generate embeddings for medical text(s)

        Args:
            texts: Single text or list of texts

        Returns:
            Embedding array of shape (n_texts, dimension)
        """
        if isinstance(texts, str):
            texts = [texts]

        logger.debug(f"Generating medical text embeddings for {len(texts)} texts")

        embeddings = []
        with torch.no_grad():
            for text in texts:
                # Tokenize
                inputs = self.tokenizer(
                    text,
                    return_tensors="pt",
                    padding=True,
                    truncation=True,
                    max_length=512
                ).to(self.device)

                # Get embeddings
                outputs = self.model(**inputs)

                # Use [CLS] token embedding
                embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
                embeddings.append(embedding[0])

        return np.array(embeddings)
