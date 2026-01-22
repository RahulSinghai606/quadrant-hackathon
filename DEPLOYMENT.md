# 🚀 MediVision AI - Complete Deployment Guide

**Two-tier architecture**: Next.js Frontend + FastAPI Backend

---

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- Qdrant Cloud account
- Azure OpenAI API access

---

## ⚡ Quick Start (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/RahulSinghai606/quadrant-hackathon.git
cd quadrant-hackathon
```

### 2. Configure Environment

```bash
# Configure Python backend
cp .env.example .env
# Edit .env with your Qdrant and Azure OpenAI credentials

# Configure Next.js frontend
cd frontend
cp .env.local.example .env.local
# Edit .env.local (usually just API_URL=http://localhost:8000)
```

### 3. Install Dependencies

```bash
# Python dependencies (from project root)
pip install -r requirements.txt
pip install -r backend-api/requirements.txt

# Node.js dependencies
cd frontend
npm install
```

### 4. Start Backend API

```bash
# From project root
cd backend-api
python main.py

# API will be available at http://localhost:8000
```

### 5. Start Frontend

```bash
# In a new terminal, from project root
cd frontend
npm run dev

# Frontend will be available at http://localhost:3000
```

### 6. Access Application

Open **http://localhost:3000** in your browser!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Next.js Frontend                         │
│                  (Port 3000)                             │
│  • Beautiful UI with Framer Motion                       │
│  • TypeScript + Tailwind CSS                             │
│  • Glassmorphism design                                  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST API
                   ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend                             │
│                (Port 8000)                               │
│  • Python AI/ML Integration                              │
│  • RESTful API Endpoints                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│           MediVision AI Core                             │
│  • Qdrant Vector Search                                  │
│  • Azure GPT-4o                                          │
│  • RAG System                                            │
│  • Patient Memory                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend API (FastAPI)

### Start Backend

```bash
# Development
cd backend-api
python main.py

# Production with Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/diagnose` | POST | Generate diagnosis |
| `/api/search` | POST | Search knowledge base |
| `/api/patients/{id}` | GET | Get patient summary |
| `/api/treatment` | POST | Treatment recommendations |
| `/api/collections` | GET | List Qdrant collections |

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎨 Frontend (Next.js)

### Start Frontend

```bash
# Development (with hot reload)
cd frontend
npm run dev

# Production build
npm run build
npm start
```

### Pages

- **/** - Homepage (hero landing)
- **/diagnosis** - Medical diagnosis
- **/knowledge** - Knowledge search
- **/patients** - Patient management
- **/treatment** - Treatment recommendations
- **/about** - System information

---

## 🔐 Environment Configuration

### Backend (.env)

```bash
# Qdrant Configuration
QDRANT_URL=https://your-cluster-url:6333
QDRANT_API_KEY=your_qdrant_api_key

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-endpoint.azure.com/...
AZURE_OPENAI_API_KEY=your_azure_api_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Application Configuration
APP_ENV=development
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐳 Docker Deployment

### Backend Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt backend-api/requirements.txt ./
COPY src/ ./src/
COPY backend-api/ ./backend-api/
COPY .env .env

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r backend-api/requirements.txt

WORKDIR /app/backend-api

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped
```

---

## ☁️ Cloud Deployment

### Frontend (Vercel)

```bash
cd frontend
npm install -g vercel
vercel

# Set environment variable:
# NEXT_PUBLIC_API_URL = https://your-backend-url.com
```

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy!

---

## 🧪 Testing

### Backend Health Check

```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "status": "online",
  "service": "MediVision AI API",
  "version": "1.0.0"
}
```

### Frontend Access

Open **http://localhost:3000** - should see beautiful hero page

### Full Flow Test

1. Navigate to `/diagnosis`
2. Load demo scenario S001
3. Click "Generate Diagnosis"
4. See AI diagnosis with evidence!

---

## 📊 Performance Optimization

### Backend

- Use Uvicorn with multiple workers
- Enable async processing
- Cache embedding models
- Connection pooling for Qdrant

### Frontend

- Next.js automatic code splitting
- Image optimization
- Static page generation
- Route prefetching

---

## 🔍 Troubleshooting

### Backend Issues

**Error**: "System not initialized"
- **Solution**: Check Qdrant and Azure OpenAI credentials in `.env`

**Error**: "Port 8000 already in use"
```bash
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Error**: "API connection refused"
- **Solution**: Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Error**: "Module not found"
```bash
cd frontend
rm -rf node_modules
npm install
```

---

## 🎯 Production Checklist

### Backend

- [ ] Update CORS allowed origins
- [ ] Set `APP_ENV=production`
- [ ] Configure proper logging
- [ ] Set up monitoring (Sentry)
- [ ] Enable HTTPS
- [ ] Rate limiting
- [ ] API authentication

### Frontend

- [ ] Set production API URL
- [ ] Enable analytics
- [ ] Configure CDN
- [ ] Optimize images
- [ ] Enable caching
- [ ] Security headers
- [ ] Error tracking

---

## 📈 Scaling

### Backend

- Horizontal scaling with multiple workers
- Load balancer (Nginx/Caddy)
- Caching layer (Redis)
- Database connection pooling

### Frontend

- CDN for static assets
- Edge caching
- Image optimization
- Code splitting

---

## 🔒 Security

### Backend

- Environment variables for secrets
- HTTPS only in production
- Rate limiting
- Input validation
- CORS configuration
- API authentication

### Frontend

- Environment variables for API URLs
- CSP headers
- HTTPS only
- XSS protection
- CSRF tokens

---

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:8000/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🎉 Summary

**Congratulations!** You now have a production-ready, beautifully designed medical AI system:

✅ **Backend**: FastAPI + Python AI/ML
✅ **Frontend**: Next.js + TypeScript + Framer Motion
✅ **UI**: Glassmorphism + Modern animations
✅ **Ready**: For hackathon demo and production use

**Access**: http://localhost:3000
**API Docs**: http://localhost:8000/docs

---

**Built with ❤️ for Convolve 4.0 Hackathon**
