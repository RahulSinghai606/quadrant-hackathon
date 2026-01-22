'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ClinicalCard from '@/components/ClinicalCard';
import AnimatedButton from '@/components/AnimatedButton';
import { FaStethoscope, FaBrain, FaChartLine, FaShieldAlt, FaRocket, FaHeart } from 'react-icons/fa';

const features = [
  {
    icon: FaStethoscope,
    title: 'AI-Powered Diagnosis',
    description: 'Evidence-based medical diagnosis with source citations from verified medical literature.',
  },
  {
    icon: FaBrain,
    title: 'Long-term Memory',
    description: 'Persistent patient history with semantic retrieval for continuous care.',
  },
  {
    icon: FaChartLine,
    title: 'Smart Analytics',
    description: 'Advanced insights from medical data patterns using vector similarity.',
  },
  {
    icon: FaShieldAlt,
    title: 'Privacy First',
    description: 'HIPAA-compliant security with data isolation and encryption.',
  },
];

const stats = [
  { value: '400M+', label: 'People Served' },
  { value: '<200ms', label: 'Search Latency' },
  { value: '95%', label: 'Accuracy' },
  { value: '24/7', label: 'Availability' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-clinical-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block mb-6 animate-fade-in">
              <span className="tag">
                🚀 Powered by Qdrant Vector Search
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
              <span className="text-clinical-text">Medi</span>
              <span className="gradient-text">Vision</span>
              <span className="text-clinical-text"> AI</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-clinical-muted mb-4 animate-slide-up stagger-1">
              Advanced Healthcare Memory Assistant
            </p>
            <p className="text-lg text-clinical-muted/80 mb-10 max-w-2xl mx-auto animate-slide-up stagger-2">
              Combining vector search, long-term memory, and evidence-based reasoning
              to revolutionize healthcare access for underserved communities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center animate-slide-up stagger-3">
              <Link href="/diagnosis">
                <AnimatedButton variant="primary" icon={<FaStethoscope />}>
                  Start Diagnosis
                </AnimatedButton>
              </Link>
              <Link href="/knowledge">
                <AnimatedButton variant="outline" icon={<FaRocket />}>
                  Explore Knowledge
                </AnimatedButton>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <ClinicalCard
                key={stat.label}
                variant="accent"
                className={`text-center animate-slide-up stagger-${index + 1}`}
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-clinical-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-clinical-muted">{stat.label}</div>
              </ClinicalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-lg text-clinical-muted max-w-2xl mx-auto">
              Production-grade AI healthcare system with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <ClinicalCard key={feature.title} className="h-full group">
                  <div className="w-12 h-12 rounded-xl bg-clinical-accent/10 border border-clinical-accent/30 flex items-center justify-center mb-4 group-hover:bg-clinical-accent/20 group-hover:border-clinical-accent transition-all duration-300">
                    <Icon className="text-clinical-accent text-xl" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-clinical-text">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-clinical-muted">
                    {feature.description}
                  </p>
                </ClinicalCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-narrow">
          <ClinicalCard variant="accent" className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-clinical-coral/10 border border-clinical-coral/30 flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-clinical-coral text-2xl" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 gradient-text">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-lg text-clinical-muted mb-8 max-w-xl mx-auto">
              Join us in making quality healthcare accessible to everyone.
              Experience the future of medical intelligence.
            </p>
            <Link href="/diagnosis">
              <AnimatedButton variant="primary" icon={<FaStethoscope />}>
                Get Started Now
              </AnimatedButton>
            </Link>
          </ClinicalCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-clinical-border py-8 mt-8">
        <div className="container-wide text-center">
          <p className="text-clinical-muted">
            Built with ❤️ for <span className="text-clinical-accent">Convolve 4.0</span> Hackathon
          </p>
          <p className="text-sm text-clinical-muted/60 mt-2">
            Powered by Qdrant 🚀 Azure GPT-4o 🧠 Next.js ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}
