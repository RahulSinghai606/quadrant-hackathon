# ✨ Next.js Frontend - Modern UI Implementation

**Complete two-tier architecture with production-ready frontend**

---

## 🎨 Overview

Built a **stunning Next.js 14 frontend** with **Framer Motion animations** as requested, replacing the Gradio interface with a production-grade web application.

### Key Features

✅ **Next.js 14** with TypeScript and App Router
✅ **Framer Motion** for smooth, professional animations
✅ **Glassmorphism UI** with frosted-glass aesthetic
✅ **Tailwind CSS** with custom medical theme colors
✅ **Fully Responsive** - desktop, tablet, mobile optimized
✅ **FastAPI Backend** exposing Python AI via REST
✅ **5 Beautiful Pages** - all fully functional with animations

---

## 📁 Project Structure

```
convolve/
├── frontend/                          # Next.js Frontend (Port 3000)
│   ├── app/
│   │   ├── page.tsx                  # Homepage with hero, stats, features
│   │   ├── diagnosis/page.tsx        # Medical diagnosis with demos
│   │   ├── knowledge/page.tsx        # Vector search interface
│   │   ├── patients/page.tsx         # Patient memory dashboard
│   │   ├── treatment/page.tsx        # Treatment recommendations
│   │   ├── about/page.tsx            # System information
│   │   ├── layout.tsx                # Root layout with Toaster
│   │   └── globals.css               # Glassmorphism styles
│   ├── components/
│   │   ├── GlassCard.tsx            # Reusable glass card with Framer Motion
│   │   ├── AnimatedButton.tsx       # Animated button with loading states
│   │   └── Navbar.tsx               # Navigation with animated active tab
│   ├── package.json                  # Next.js dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.ts            # Custom medical theme
│   └── .env.local.example            # Frontend environment template
│
├── backend-api/                       # FastAPI Backend (Port 8000)
│   ├── main.py                       # REST API exposing Python AI
│   └── requirements.txt              # FastAPI dependencies
│
├── src/                              # MediVision AI Core (Python)
│   ├── core/                         # Qdrant, Azure OpenAI, RAG
│   └── ...
│
├── DEPLOYMENT.md                     # Complete two-tier deployment guide
└── README.md                         # Updated for Next.js architecture
```

---

## 🎯 Pages Implemented

### 1. **Homepage** (`app/page.tsx`)
**Purpose**: Hero landing page with brand introduction

**Features**:
- Animated hero section with gradient backgrounds
- Floating gradient orbs with infinite animations
- Stats counter with medical-themed icons
- Feature cards with hover effects
- Call-to-action buttons with Framer Motion
- Responsive grid layout

**Animations**:
- Fade-in on scroll
- Gradient orbs with rotation and scale
- Hover scale effects on cards
- Staggered animations for feature grid

**Visual Elements**:
- Medical gradient (blue → purple → pink)
- Glassmorphism cards with backdrop blur
- Icon animations (Zap, Brain, Shield, Activity)

---

### 2. **Diagnosis** (`app/diagnosis/page.tsx`)
**Purpose**: AI-powered medical diagnosis with evidence

**Features**:
- Patient ID input with validation
- Symptom description textarea
- Demo scenario quick-load buttons (S001, S002, S003)
- Patient history toggle
- Real-time API integration with loading states
- Diagnosis display with markdown support
- Evidence cards with relevance scores
- Progress bars for evidence strength

**Animations**:
- Rotating icon on loading
- Staggered evidence card animations
- Progress bar fill animations
- Hover effects on demo buttons

**Demo Scenarios**:
- S001: Pneumonia symptoms
- S002: Migraine symptoms
- S003: Diabetes symptoms

---

### 3. **Knowledge Search** (`app/knowledge/page.tsx`)
**Purpose**: Vector search through medical knowledge base

**Features**:
- Search bar with Enter key support
- Quick search suggestions
- Result cards with relevance scoring
- Category badges (disease, symptom, treatment, etc.)
- Source citations
- Empty state with animated icon
- Loading spinner with rotation

**Animations**:
- Book icon rotation on loading
- Staggered result card animations
- Progress bar for relevance scores
- Category badge scale animation
- Floating book icon in empty state

**Search Features**:
- Semantic vector search
- Top-k results with scores
- Category color coding
- Source attribution

---

### 4. **Patients** (`app/patients/page.tsx`)
**Purpose**: Patient memory and medical history tracking

**Features**:
- Patient ID search with demo option
- Patient summary header with avatar
- Total interactions counter
- Three stat cards:
  - Key Conditions (blue theme)
  - Medications (purple theme)
  - Risk Factors (red theme)
- Medical history timeline
- Event type icons (diagnosis, prescription, lab results, follow-up)
- Timestamp formatting
- Demo patient (P001) with full history

**Animations**:
- Avatar scale animation (spring)
- Timeline event staggered animations
- Event icon scale-in animations
- Card hover effects
- Brain icon pulse in header

**Timeline Events**:
- Diagnosis (blue): Activity icon
- Prescription (purple): FileText icon
- Lab Results (green): TrendingUp icon
- Follow-up (orange): Clock icon

---

### 5. **Treatment** (`app/treatment/page.tsx`)
**Purpose**: Evidence-based treatment recommendations

**Features**:
- Diagnosis input textarea
- Patient context input (optional)
- Quick scenario buttons (Diabetes, Hypertension, Pneumonia)
- Warning alerts with red border
- Main recommendations with markdown
- Alternative options section
- Supporting evidence with scores
- Loading states with rotating icon

**Animations**:
- Pill icon rotation animation
- Warning pulse animation
- Staggered section animations
- Evidence card slide-in
- Progress bars for evidence scores

**Safety Features**:
- Prominent warning section
- Alternative treatment options
- Evidence-based recommendations
- Patient context consideration

---

### 6. **About** (`app/about/page.tsx`)
**Purpose**: System information and technology showcase

**Features**:
- Animated award icon in header
- Four stat cards:
  - Vector Collections count
  - Total Vectors count
  - API Version
  - System Status (Online/Offline)
- Core features grid (6 cards)
- Technology stack sections:
  - Frontend Stack (Next.js, TypeScript, Framer Motion, Tailwind)
  - Backend Stack (FastAPI, Python, Qdrant, Azure OpenAI)
- Vector collections info with progress bars
- Live system status indicator

**Animations**:
- Award icon rotation and scale
- Stat icons pulse animations
- Feature card hover rotations
- Tech stack cards slide-in
- Status indicator pulse (green dot)

**Visual Features**:
- Gradient backgrounds for feature cards
- Color-coded tech stack sections
- Collection progress visualization
- Live status monitoring

---

## 🎨 UI Components

### **GlassCard** (`components/GlassCard.tsx`)
Reusable glass card with Framer Motion animations

**Props**:
- `children`: React node content
- `className`: Additional CSS classes
- `delay`: Animation delay (default: 0)
- `hover`: Enable hover effect (default: true)

**Features**:
- Glassmorphism effect (backdrop blur, transparency)
- Fade-in and slide-up animation
- Hover scale and shadow effect
- Customizable delay for staggered animations

**Usage**:
```tsx
<GlassCard delay={0.2} hover className="mb-4">
  <h3>Title</h3>
  <p>Content</p>
</GlassCard>
```

---

### **AnimatedButton** (`components/AnimatedButton.tsx`)
Animated button with loading states

**Variants**:
- `primary`: Medical gradient (blue → purple)
- `secondary`: White with border
- `danger`: Red for warnings

**Props**:
- `children`: Button content
- `onClick`: Click handler
- `loading`: Show loading spinner
- `disabled`: Disable button
- `variant`: Style variant
- `className`: Additional CSS

**Features**:
- Hover scale animation
- Tap scale animation
- Loading spinner
- Disabled state styling

**Usage**:
```tsx
<AnimatedButton
  onClick={handleAction}
  loading={isLoading}
  variant="primary"
>
  Submit
</AnimatedButton>
```

---

### **Navbar** (`components/Navbar.tsx`)
Navigation bar with animated active tab

**Features**:
- Five navigation links (Home, Diagnosis, Knowledge, Patients, Treatment)
- Animated active tab indicator (Framer Motion layoutId)
- Spring animation on tab change
- Glassmorphism background
- Responsive design

**Animation**:
- Active tab background slides smoothly between links
- Spring physics for natural movement
- Hover effects on links

---

## 🎨 Design System

### **Custom Tailwind Theme** (`tailwind.config.ts`)

**Medical Color Palette**:
```typescript
colors: {
  medical: {
    blue: '#667eea',      // Primary brand color
    purple: '#764ba2',     // Secondary brand color
    pink: '#f093fb',       // Accent color
    red: '#f5576c',        // Error/warning color
  }
}
```

**Custom Animations**:
```typescript
animation: {
  'float': 'float 6s ease-in-out infinite',      // Floating gradient orbs
  'shimmer': 'shimmer 2s linear infinite',       // Shimmer effect
  'pulse-slow': 'pulse 3s ease-in-out infinite', // Slow pulse
}
```

**Gradient Classes**:
- `medical-gradient`: Blue → Purple gradient
- `medical-gradient-2`: Purple → Pink gradient
- `medical-gradient-3`: Blue → Purple → Pink gradient

---

### **Global Styles** (`app/globals.css`)

**Glassmorphism**:
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

**Gradient Text**:
```css
.gradient-text {
  background: linear-gradient(to right, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

**Animations**:
```css
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 🔌 Backend API

### **FastAPI Backend** (`backend-api/main.py`)

**Endpoints**:
- `GET /`: Health check
- `POST /api/diagnose`: Medical diagnosis with evidence
- `POST /api/search`: Vector search in knowledge base
- `GET /api/patients/{id}`: Patient summary and history
- `POST /api/treatment`: Treatment recommendations
- `GET /api/collections`: Qdrant collections info

**Features**:
- CORS middleware for frontend communication
- Imports from existing Python AI core
- JSON request/response models
- Error handling with detail messages

**Example**:
```python
@app.post("/api/diagnose", response_model=DiagnosisResponse)
async def diagnose_patient(request: DiagnosisRequest):
    result = rag_system.diagnose_with_context(
        patient_id=request.patient_id,
        symptoms=request.symptoms,
        use_patient_history=request.use_history
    )
    return DiagnosisResponse(
        diagnosis=result["diagnosis"],
        evidence=result["evidence"],
        confidence=result.get("confidence", 0.0)
    )
```

---

## 🚀 Deployment

### **Development**

**Terminal 1 - Backend**:
```bash
cd backend-api
python main.py
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### **Production**

**Frontend (Vercel)**:
```bash
cd frontend
npm run build
npm start
```

**Backend (Railway/Render)**:
```bash
cd backend-api
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

See `DEPLOYMENT.md` for complete guide.

---

## 📊 Comparison: Gradio vs Next.js

| Feature | Gradio (Legacy) | Next.js (New) |
|---------|----------------|---------------|
| **UI Quality** | Functional | Production-grade |
| **Animations** | None | Framer Motion throughout |
| **Design** | Basic | Glassmorphism + gradients |
| **Responsiveness** | Limited | Fully responsive |
| **Customization** | Low | Full control |
| **Type Safety** | Python only | TypeScript frontend |
| **Loading States** | Basic | Smooth animations |
| **Performance** | Good | Optimized with Next.js |
| **Deployment** | Single app | Decoupled frontend/backend |
| **Developer Experience** | Python-focused | Modern web stack |

---

## 🎯 Achievement Summary

✅ **Replaced Gradio** with modern Next.js frontend as requested
✅ **Framer Motion** animations throughout all pages
✅ **Glassmorphism UI** with beautiful gradient effects
✅ **5 Complete Pages** - all functional with real API integration
✅ **Reusable Components** - GlassCard, AnimatedButton, Navbar
✅ **FastAPI Backend** - REST API exposing Python AI
✅ **Custom Tailwind Theme** - Medical color palette and animations
✅ **Production Ready** - TypeScript, responsive, accessible
✅ **Comprehensive Documentation** - DEPLOYMENT.md, README updates
✅ **Git History** - Clean commits with detailed messages

---

## 🌐 Access

**Production UI**: http://localhost:3000
**API Documentation**: http://localhost:8000/docs
**GitHub Repository**: https://github.com/RahulSinghai606/quadrant-hackathon

---

**Built with ❤️ for Convolve 4.0 Hackathon**
**"Best of best UI" with Next.js + Framer Motion + Glassmorphism** ✨
