# MediVision AI - Next.js Frontend

**State-of-the-art** medical UI built with Next.js 14, TypeScript, Framer Motion, and Tailwind CSS.

## ✨ Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Framer Motion** for beautiful animations
- **Tailwind CSS** for styling
- **Glassmorphism** UI design
- **Responsive** design for all devices
- **Production-ready** architecture

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎨 Pages

- **/** - Beautiful hero landing page
- **/diagnosis** - AI-powered medical diagnosis
- **/knowledge** - Medical knowledge search
- **/patients** - Patient memory management
- **/treatment** - Treatment recommendations
- **/about** - System information

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── diagnosis/       # Diagnosis page
│   ├── knowledge/       # Knowledge search
│   ├── patients/        # Patient management
│   ├── treatment/       # Treatment recommendations
│   ├── about/           # About page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── GlassCard.tsx    # Glass card component
│   └── AnimatedButton.tsx # Animated button
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🎨 Design System

### Colors

- **Primary**: Medical Blue (#667eea) to Purple (#764ba2)
- **Secondary**: Pink (#f093fb) to Red (#f5576c)
- **Success**: Green (#43e97b) to Cyan (#38f9d7)

### Effects

- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradients**: Smooth color transitions
- **Animations**: Framer Motion for fluid transitions
- **Shadows**: Soft shadows with glow effects

## 🔌 API Integration

Frontend communicates with FastAPI backend:

```typescript
const response = await axios.post('/api/diagnose', {
  patient_id: 'P001',
  symptoms: '...',
  use_history: true
});
```

## 🛠️ Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Markdown**: React Markdown
- **Notifications**: React Hot Toast

## 📱 Responsive Design

Fully responsive across:
- Desktop (1920px+)
- Laptop (1280px+)
- Tablet (768px+)
- Mobile (375px+)

## ⚡ Performance

- **Server-side rendering** with Next.js
- **Code splitting** automatic
- **Image optimization** built-in
- **Fast refresh** in development

## 🎭 Animation System

Using Framer Motion for:
- Page transitions
- Component animations
- Hover effects
- Loading states
- Micro-interactions

## 🔒 Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

## 📚 Key Components

### GlassCard
```tsx
<GlassCard delay={0.2}>
  <h2>Beautiful Content</h2>
</GlassCard>
```

### AnimatedButton
```tsx
<AnimatedButton
  variant="primary"
  loading={loading}
  icon={<FaIcon />}
>
  Click Me
</AnimatedButton>
```

### Navbar
```tsx
<Navbar />
```

## 🎨 Custom Animations

```css
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.glass {
  @apply bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl;
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-medical-blue to-medical-purple;
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t medivision-frontend .
docker run -p 3000:3000 medivision-frontend
```

## 🧪 Development Tips

1. **Hot Reload**: Changes appear instantly
2. **TypeScript**: Full type checking
3. **ESLint**: Code quality enforcement
4. **Prettier**: Automatic formatting

## 📄 License

MIT License - Part of MediVision AI project

---

**Built with ❤️ for Convolve 4.0 Hackathon**
