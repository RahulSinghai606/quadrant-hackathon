"""
Configuration management with secure credential handling
"""
import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # Qdrant Configuration
    qdrant_url: str = Field(..., env="QDRANT_URL")
    qdrant_api_key: str = Field(..., env="QDRANT_API_KEY")

    # Azure OpenAI Configuration
    azure_openai_endpoint: str = Field(..., env="AZURE_OPENAI_ENDPOINT")
    azure_openai_api_key: str = Field(..., env="AZURE_OPENAI_API_KEY")
    azure_openai_deployment: str = Field(default="gpt-4o", env="AZURE_OPENAI_DEPLOYMENT")
    azure_openai_api_version: str = Field(default="2024-02-15-preview", env="AZURE_OPENAI_API_VERSION")

    # Application Configuration
    app_env: str = Field(default="development", env="APP_ENV")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")

    # Paths
    project_root: Path = Path(__file__).parent.parent.parent
    data_dir: Path = project_root / "data"
    models_dir: Path = project_root / "models"

    # Collection Names
    medical_images_collection: str = "medical_images"
    medical_texts_collection: str = "medical_texts"
    patient_memory_collection: str = "patient_memory"

    # Model Configuration
    text_embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    medical_text_model: str = "microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract-fulltext"
    image_embedding_model: str = "microsoft/resnet-50"

    # Vector Dimensions
    text_embedding_dim: int = 384
    medical_text_embedding_dim: int = 768
    image_embedding_dim: int = 2048

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


def get_settings() -> Settings:
    """Get application settings singleton"""
    return Settings()


# Global settings instance
settings = get_settings()
