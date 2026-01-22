"""
Image embedding generation for medical images
"""
from typing import Union, List
from pathlib import Path
import numpy as np
from PIL import Image
import torch
from torchvision import transforms, models
from transformers import AutoImageProcessor, ResNetModel

from src.utils import settings, setup_logger

logger = setup_logger(__name__, settings.log_level)


class MedicalImageEmbedder:
    """Generate embeddings for medical images using ResNet"""

    def __init__(self, model_name: str = None):
        """
        Initialize medical image embedder

        Args:
            model_name: Model name for image embedding
        """
        self.model_name = model_name or settings.image_embedding_model
        logger.info(f"Loading image embedding model: {self.model_name}")

        # Load processor and model
        self.processor = AutoImageProcessor.from_pretrained(self.model_name)
        self.model = ResNetModel.from_pretrained(self.model_name)
        self.model.eval()
        self.dimension = settings.image_embedding_dim

        # Move to GPU if available
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        logger.info(f"Image embedder initialized on {self.device}")

        # Image preprocessing
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def load_image(self, image_path: Union[str, Path]) -> Image.Image:
        """
        Load and preprocess image

        Args:
            image_path: Path to image file

        Returns:
            PIL Image
        """
        image_path = Path(image_path)
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        image = Image.open(image_path).convert("RGB")
        return image

    def embed(self, images: Union[str, Path, Image.Image, List]) -> np.ndarray:
        """
        Generate embeddings for image(s)

        Args:
            images: Single image path/PIL Image or list of them

        Returns:
            Embedding array of shape (n_images, dimension)
        """
        # Handle single image
        if isinstance(images, (str, Path, Image.Image)):
            images = [images]

        logger.debug(f"Generating embeddings for {len(images)} images")

        embeddings = []
        with torch.no_grad():
            for img in images:
                # Load image if path
                if isinstance(img, (str, Path)):
                    img = self.load_image(img)

                # Process image
                inputs = self.processor(images=img, return_tensors="pt")
                inputs = {k: v.to(self.device) for k, v in inputs.items()}

                # Get embeddings
                outputs = self.model(**inputs)

                # Use pooled output
                embedding = outputs.pooler_output.cpu().numpy()
                embeddings.append(embedding[0])

        return np.array(embeddings)

    def embed_from_array(self, image_array: np.ndarray) -> np.ndarray:
        """
        Generate embedding from numpy array

        Args:
            image_array: Image as numpy array (H, W, C)

        Returns:
            Embedding vector
        """
        # Convert to PIL Image
        if image_array.dtype != np.uint8:
            image_array = (image_array * 255).astype(np.uint8)

        image = Image.fromarray(image_array)
        return self.embed(image)
