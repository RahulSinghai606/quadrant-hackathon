"""
FastAPI Backend for MediVision AI
Exposes Python AI functionality via REST API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sys
from pathlib import Path

# Add parent directory to path to import src modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.search import MedicalRAGSystem
from src.memory import PatientMemoryManager
from src.utils import settings, setup_logger

# Initialize FastAPI
app = FastAPI(
    title="MediVision AI API",
    description="Healthcare Intelligence Backend API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI system
logger = setup_logger(__name__, settings.log_level)
rag_system = None

@app.on_event("startup")
async def startup_event():
    """Initialize AI system on startup"""
    global rag_system
    try:
        logger.info("Initializing MedicalRAGSystem...")
        rag_system = MedicalRAGSystem()
        logger.info("System initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize system: {e}")

# Pydantic models for request/response
class DiagnosisRequest(BaseModel):
    patient_id: str
    symptoms: str
    use_history: bool = True

class DiagnosisResponse(BaseModel):
    patient_id: str
    diagnosis: str
    evidence: List[Dict[str, Any]]
    history_used: bool

class SearchRequest(BaseModel):
    query: str
    specialty: Optional[str] = None
    limit: int = 5

class SearchResponse(BaseModel):
    query: str
    results: List[Dict[str, Any]]
    count: int

class PatientSummaryResponse(BaseModel):
    patient_id: str
    total_interactions: int
    interaction_types: Dict[str, int]
    first_visit: Optional[str]
    last_visit: Optional[str]
    recent_interactions: List[Dict[str, Any]]

class TreatmentRequest(BaseModel):
    patient_id: str
    diagnosis: str
    contraindications: Optional[List[str]] = None

class TreatmentResponse(BaseModel):
    patient_id: str
    recommendations: str
    evidence: List[Dict[str, Any]]

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "MediVision AI API",
        "version": "1.0.0"
    }

@app.post("/api/diagnose", response_model=DiagnosisResponse)
async def diagnose_patient(request: DiagnosisRequest):
    """
    Diagnose patient symptoms with AI
    """
    try:
        if not rag_system:
            raise HTTPException(status_code=503, detail="System not initialized")

        result = rag_system.diagnose_with_context(
            patient_id=request.patient_id,
            symptoms=request.symptoms,
            use_patient_history=request.use_history
        )

        return DiagnosisResponse(
            patient_id=result["patient_id"],
            diagnosis=result["diagnosis"],
            evidence=result["retrieved_evidence"],
            history_used=result["patient_history_used"]
        )

    except Exception as e:
        logger.error(f"Diagnosis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search", response_model=SearchResponse)
async def search_knowledge(request: SearchRequest):
    """
    Search medical knowledge base
    """
    try:
        if not rag_system:
            raise HTTPException(status_code=503, detail="System not initialized")

        filters = {"specialty": request.specialty} if request.specialty else None

        results = rag_system.search_medical_texts(
            query=request.query,
            filters=filters,
            limit=request.limit
        )

        return SearchResponse(
            query=request.query,
            results=results,
            count=len(results)
        )

    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/patients/{patient_id}", response_model=PatientSummaryResponse)
async def get_patient_summary(patient_id: str):
    """
    Get patient medical history summary
    """
    try:
        if not rag_system:
            raise HTTPException(status_code=503, detail="System not initialized")

        summary = rag_system.memory_manager.get_patient_summary(patient_id)

        return PatientSummaryResponse(
            patient_id=summary["patient_id"],
            total_interactions=summary["total_interactions"],
            interaction_types=summary["interaction_types"],
            first_visit=summary.get("first_visit"),
            last_visit=summary.get("last_visit"),
            recent_interactions=summary["recent_interactions"]
        )

    except Exception as e:
        logger.error(f"Patient summary error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/treatment", response_model=TreatmentResponse)
async def recommend_treatment(request: TreatmentRequest):
    """
    Get treatment recommendations
    """
    try:
        if not rag_system:
            raise HTTPException(status_code=503, detail="System not initialized")

        result = rag_system.recommend_treatment(
            patient_id=request.patient_id,
            diagnosis=request.diagnosis,
            contraindications=request.contraindications
        )

        return TreatmentResponse(
            patient_id=result["patient_id"],
            recommendations=result["recommendations"],
            evidence=result["evidence_sources"]
        )

    except Exception as e:
        logger.error(f"Treatment recommendation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/collections")
async def list_collections():
    """
    List active Qdrant collections
    """
    try:
        if not rag_system:
            raise HTTPException(status_code=503, detail="System not initialized")

        collections = rag_system.qdrant.list_collections()

        info = []
        for collection in collections:
            try:
                col_info = rag_system.qdrant.get_collection_info(collection)
                info.append(col_info)
            except:
                info.append({"name": collection})

        return {
            "collections": info,
            "count": len(collections)
        }

    except Exception as e:
        logger.error(f"Collections error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
