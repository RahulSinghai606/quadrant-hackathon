'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Brain,
  Zap,
  Shield,
  Activity,
  Server,
  Code,
  Award,
  Layers,
  GitBranch,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ClinicalCard from '@/components/ClinicalCard';

interface SystemStatus {
  status: string;
  service: string;
  version: string;
  qdrant_status?: string;
  azure_status?: string;
}

interface CollectionInfo {
  name: string;
  vectors_count?: number | null;
  indexed_vectors_count?: number | null;
  config?: any;
}

export default function AboutPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    setLoading(true);
    try {
      const statusResponse = await axios.get<SystemStatus>(
        `${process.env.NEXT_PUBLIC_API_URL}/`
      );
      setSystemStatus(statusResponse.data);

      const collectionsResponse = await axios.get<{ collections: CollectionInfo[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/collections`
      );
      setCollections(collectionsResponse.data.collections);
    } catch (error: any) {
      console.error('Failed to load system info:', error);
      toast.error('Failed to load system information');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Database,
      title: 'Qdrant Vector Search',
      description: 'High-performance vector similarity search with 99.9% accuracy',
    },
    {
      icon: Brain,
      title: 'Azure GPT-4o',
      description: 'Advanced reasoning and natural language understanding',
    },
    {
      icon: Zap,
      title: 'RAG Architecture',
      description: 'Retrieval-Augmented Generation for evidence-based responses',
    },
    {
      icon: Shield,
      title: 'Multi-Modal Embeddings',
      description: 'BioBERT, Sentence-BERT, and ResNet-50 for comprehensive analysis',
    },
    {
      icon: Activity,
      title: 'Patient Memory',
      description: 'Long-term context tracking across interactions',
    },
    {
      icon: Server,
      title: 'Production Ready',
      description: 'Scalable FastAPI backend with Next.js frontend',
    },
  ];

  const techStack = {
    frontend: [
      { name: 'Next.js 14', icon: Code },
      { name: 'TypeScript', icon: Code },
      { name: 'Tailwind CSS', icon: Layers },
      { name: 'Lucide Icons', icon: Zap },
    ],
    backend: [
      { name: 'FastAPI', icon: Server },
      { name: 'Python 3.10', icon: Code },
      { name: 'Qdrant Client', icon: Database },
      { name: 'Azure OpenAI', icon: Brain },
    ],
  };

  const stats = [
    { label: 'Vector Collections', value: collections.length, icon: Database },
    {
      label: 'Total Vectors',
      value: collections.reduce((sum, c) => sum + (c.vectors_count ?? 0), 0).toLocaleString(),
      icon: Layers,
    },
    { label: 'API Version', value: systemStatus?.version || 'N/A', icon: GitBranch },
    {
      label: 'System Status',
      value: systemStatus?.status === 'online' ? 'Online' : 'Offline',
      icon: Activity,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container-wide section">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-clinical-accent/20 blur-3xl rounded-full" />
            <Award className="relative w-16 h-16 text-clinical-accent" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text mb-4">MediVision AI</h1>
          <p className="text-xl text-clinical-muted mb-2">Healthcare Memory Assistant</p>
          <p className="text-lg text-clinical-muted/60">
            Built for Convolve 4.0 Hackathon • Powered by Qdrant & Azure OpenAI
          </p>
        </div>

        {/* System Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <ClinicalCard key={stat.label} variant="accent" className="text-center">
              <stat.icon className="w-8 h-8 text-clinical-accent mx-auto mb-3" />
              <div className="text-2xl font-display font-bold text-clinical-accent mb-1">{stat.value}</div>
              <div className="text-sm text-clinical-muted">{stat.label}</div>
            </ClinicalCard>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-clinical-text mb-8 text-center">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <ClinicalCard key={feature.title} className="h-full group">
                <div className="w-12 h-12 rounded-xl bg-clinical-accent/10 border border-clinical-accent/30 flex items-center justify-center mb-4 group-hover:bg-clinical-accent/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-clinical-accent" />
                </div>
                <h3 className="text-lg font-display font-semibold text-clinical-text mb-2">{feature.title}</h3>
                <p className="text-sm text-clinical-muted">{feature.description}</p>
              </ClinicalCard>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Frontend */}
          <ClinicalCard>
            <h3 className="text-xl font-display font-bold text-clinical-text mb-6 flex items-center gap-3">
              <Code className="w-5 h-5 text-clinical-accent" />
              Frontend Stack
            </h3>
            <div className="space-y-3">
              {techStack.frontend.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-3 p-3 bg-clinical-accent/10 border border-clinical-accent/20 rounded-lg"
                >
                  <tech.icon className="w-5 h-5 text-clinical-accent" />
                  <span className="font-semibold text-clinical-text">{tech.name}</span>
                </div>
              ))}
            </div>
          </ClinicalCard>

          {/* Backend */}
          <ClinicalCard>
            <h3 className="text-xl font-display font-bold text-clinical-text mb-6 flex items-center gap-3">
              <Server className="w-5 h-5 text-purple-400" />
              Backend Stack
            </h3>
            <div className="space-y-3">
              {techStack.backend.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-3 p-3 bg-purple-400/10 border border-purple-400/20 rounded-lg"
                >
                  <tech.icon className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-clinical-text">{tech.name}</span>
                </div>
              ))}
            </div>
          </ClinicalCard>
        </div>

        {/* Collections Info */}
        {collections.length > 0 && (
          <ClinicalCard className="mb-12">
            <h3 className="text-xl font-display font-bold text-clinical-text mb-6 flex items-center gap-3">
              <Database className="w-5 h-5 text-clinical-accent" />
              Vector Collections
            </h3>
            <div className="space-y-4">
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  className="p-4 bg-clinical-elevated border border-clinical-border rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-display font-semibold text-clinical-text">{collection.name}</h4>
                    <span className="tag">
                      {(collection.vectors_count ?? 0).toLocaleString()} vectors
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-clinical-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-clinical-accent transition-all duration-500"
                        style={{
                          width: `${(collection.vectors_count ?? 0) > 0 && (collection.indexed_vectors_count ?? 0) > 0
                            ? ((collection.indexed_vectors_count ?? 0) / (collection.vectors_count ?? 1)) * 100
                            : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-clinical-muted">
                      {(collection.vectors_count ?? 0) > 0
                        ? (((collection.indexed_vectors_count ?? 0) / (collection.vectors_count ?? 1)) * 100).toFixed(1)
                        : 0}% indexed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ClinicalCard>
        )}

        {/* Footer */}
        <ClinicalCard className="text-center">
          <p className="text-clinical-muted mb-2">
            Built with ❤️ for <span className="text-clinical-accent">Convolve 4.0</span> Hackathon
          </p>
          <p className="text-sm text-clinical-muted/60">
            Leveraging Qdrant Vector Search for Societal Impact in Healthcare
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${systemStatus?.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-clinical-muted'}`} />
            <span className="text-sm font-semibold text-clinical-text">
              {systemStatus?.status === 'online' ? 'System Online' : 'System Offline'}
            </span>
          </div>
        </ClinicalCard>
      </div>
    </div>
  );
}
