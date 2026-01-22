"""
Qdrant client wrapper with collection management
"""
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient as QdrantClientBase
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    SearchRequest,
    ScoredPoint,
)
from uuid import uuid4

from src.utils import settings, setup_logger

logger = setup_logger(__name__, settings.log_level)


class QdrantManager:
    """Manage Qdrant operations and collections"""

    def __init__(self):
        """Initialize Qdrant client"""
        logger.info(f"Connecting to Qdrant at {settings.qdrant_url}")
        self.client = QdrantClientBase(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
        )
        logger.info("Qdrant client initialized successfully")

    def create_collection(
        self,
        collection_name: str,
        vector_size: int,
        distance: Distance = Distance.COSINE,
    ) -> None:
        """
        Create a new collection if it doesn't exist

        Args:
            collection_name: Name of the collection
            vector_size: Dimension of vectors
            distance: Distance metric to use
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections().collections
            collection_names = [col.name for col in collections]

            if collection_name in collection_names:
                logger.info(f"Collection '{collection_name}' already exists")
                return

            # Create collection
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=distance,
                ),
            )
            logger.info(f"Created collection '{collection_name}' with dimension {vector_size}")

        except Exception as e:
            logger.error(f"Failed to create collection '{collection_name}': {e}")
            raise

    def upsert_points(
        self,
        collection_name: str,
        vectors: List[List[float]],
        payloads: List[Dict[str, Any]],
        ids: Optional[List[str]] = None,
    ) -> List[str]:
        """
        Insert or update points in a collection

        Args:
            collection_name: Name of the collection
            vectors: List of embedding vectors
            payloads: List of metadata dictionaries
            ids: Optional list of point IDs

        Returns:
            List of point IDs
        """
        if ids is None:
            ids = [str(uuid4()) for _ in range(len(vectors))]

        points = [
            PointStruct(
                id=point_id,
                vector=vector,
                payload=payload,
            )
            for point_id, vector, payload in zip(ids, vectors, payloads)
        ]

        self.client.upsert(
            collection_name=collection_name,
            points=points,
        )

        logger.info(f"Upserted {len(points)} points to collection '{collection_name}'")
        return ids

    def search(
        self,
        collection_name: str,
        query_vector: List[float],
        limit: int = 5,
        score_threshold: float = 0.0,
        query_filter: Optional[Filter] = None,
    ) -> List[ScoredPoint]:
        """
        Search for similar vectors

        Args:
            collection_name: Name of the collection
            query_vector: Query embedding vector
            limit: Number of results to return
            score_threshold: Minimum similarity score
            query_filter: Optional filter conditions

        Returns:
            List of search results with scores
        """
        results = self.client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            limit=limit,
            score_threshold=score_threshold,
            query_filter=query_filter,
        )

        logger.debug(f"Search returned {len(results)} results from '{collection_name}'")
        return results

    def hybrid_search(
        self,
        collection_name: str,
        query_vector: List[float],
        metadata_filters: Dict[str, Any],
        limit: int = 5,
    ) -> List[ScoredPoint]:
        """
        Perform hybrid search with semantic similarity and metadata filtering

        Args:
            collection_name: Name of the collection
            query_vector: Query embedding vector
            metadata_filters: Dictionary of metadata key-value pairs to filter
            limit: Number of results to return

        Returns:
            List of filtered search results
        """
        # Build filter conditions
        conditions = []
        for key, value in metadata_filters.items():
            conditions.append(
                FieldCondition(
                    key=key,
                    match=MatchValue(value=value),
                )
            )

        query_filter = Filter(must=conditions) if conditions else None

        return self.search(
            collection_name=collection_name,
            query_vector=query_vector,
            limit=limit,
            query_filter=query_filter,
        )

    def get_collection_info(self, collection_name: str) -> Dict[str, Any]:
        """
        Get information about a collection

        Args:
            collection_name: Name of the collection

        Returns:
            Collection information
        """
        info = self.client.get_collection(collection_name=collection_name)
        return {
            "name": collection_name,
            "vectors_count": info.vectors_count,
            "points_count": info.points_count,
            "status": info.status,
        }

    def delete_collection(self, collection_name: str) -> None:
        """
        Delete a collection

        Args:
            collection_name: Name of the collection to delete
        """
        self.client.delete_collection(collection_name=collection_name)
        logger.info(f"Deleted collection '{collection_name}'")

    def list_collections(self) -> List[str]:
        """
        List all collections

        Returns:
            List of collection names
        """
        collections = self.client.get_collections().collections
        return [col.name for col in collections]
