"""Core modules for Qdrant and LLM integration"""
from .qdrant_client import QdrantManager
from .llm_client import MedicalLLM

__all__ = ["QdrantManager", "MedicalLLM"]
