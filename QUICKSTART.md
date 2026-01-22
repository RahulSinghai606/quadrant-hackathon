# 🚀 Quick Start Guide - MediVision AI

Get up and running in 5 minutes!

## Prerequisites

- Python 3.8+
- Qdrant Cloud account (free tier)
- Azure OpenAI API access

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/RahulSinghai606/quadrant-hackathon.git
cd quadrant-hackathon
```

### 2. Run Setup Script

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your favorite editor
```

**Required credentials:**
```bash
QDRANT_URL=https://your-cluster-url:6333
QDRANT_API_KEY=your_qdrant_api_key

AZURE_OPENAI_ENDPOINT=https://your-endpoint.azure.com/...
AZURE_OPENAI_API_KEY=your_azure_api_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### 4. Run the Application

```bash
# Activate virtual environment (if not already active)
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Start the application
python app.py
```

### 5. Access the Web Interface

Open your browser to: **http://localhost:7860**

## First Steps

### Try Demo Scenarios

1. Go to **"Medical Diagnosis"** tab
2. Select a demo scenario: S001, S002, or S003
3. Click **"Load Demo"**
4. Click **"Diagnose"**
5. Review the diagnosis and retrieved evidence!

### Demo Scenarios:

- **S001**: Pneumonia symptoms
- **S002**: Migraine symptoms
- **S003**: Diabetes symptoms

## System Check

Verify everything is working:

```bash
# Check Qdrant connection
python -c "from src.core import QdrantManager; qm = QdrantManager(); print('✓ Qdrant connected:', qm.list_collections())"

# Check Azure OpenAI connection
python -c "from src.core import MedicalLLM; llm = MedicalLLM(); print('✓ Azure OpenAI connected')"
```

## Troubleshooting

### Issue: "Module not found"
**Solution:** Make sure virtual environment is activated and dependencies installed
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "Qdrant connection failed"
**Solution:** Check your QDRANT_URL and QDRANT_API_KEY in .env file

### Issue: "Azure OpenAI error"
**Solution:** Verify AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY are correct

### Issue: "Port 7860 already in use"
**Solution:** Change port in app.py or kill existing process
```bash
lsof -ti:7860 | xargs kill -9  # macOS/Linux
```

## Next Steps

1. **Explore Features**: Try all tabs (Diagnosis, Knowledge Search, Patient Memory, Treatment)
2. **Read Documentation**: Check `docs/documentation.tex` for detailed technical info
3. **Customize**: Add your own medical knowledge to the system
4. **Integrate**: Connect to your EHR or data sources

## Getting Help

- **GitHub Issues**: https://github.com/RahulSinghai606/quadrant-hackathon/issues
- **README**: Comprehensive documentation
- **LaTeX Doc**: Technical details and architecture

## API Keys Setup

### Qdrant Cloud (Free Tier)

1. Sign up: https://cloud.qdrant.io
2. Create a cluster
3. Copy cluster URL and API key
4. Paste into .env file

### Azure OpenAI

1. Access Azure AI Studio
2. Deploy GPT-4o model
3. Copy endpoint URL and API key
4. Paste into .env file

---

**You're all set! 🎉**

Start diagnosing patients with AI-powered evidence-based medicine!
