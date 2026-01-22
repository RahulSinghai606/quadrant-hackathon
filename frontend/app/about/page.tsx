'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import GlassCard from '@/components/GlassCard';

interface SystemStatus {
  status: string;
  service: string;
  version: string;
  qdrant_status?: string;
  azure_status?: string;
}

interface CollectionInfo {
  name: string;
  vectors_count: number;
  indexed_vectors_count: number;
  config: any;
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
      // Load system status
      const statusResponse = await axios.get<SystemStatus>(
        `${process.env.NEXT_PUBLIC_API_URL}/`
      );
      setSystemStatus(statusResponse.data);

      // Load collections
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
      color: 'from-blue-400 to-indigo-500',
    },
    {
      icon: Brain,
      title: 'Azure GPT-4o',
      description: 'Advanced reasoning and natural language understanding',
      color: 'from-purple-400 to-violet-500',
    },
    {
      icon: Zap,
      title: 'RAG Architecture',
      description: 'Retrieval-Augmented Generation for evidence-based responses',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Multi-Modal Embeddings',
      description: 'BioBERT, Sentence-BERT, and ResNet-50 for comprehensive analysis',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Activity,
      title: 'Patient Memory',
      description: 'Long-term context tracking across interactions',
      color: 'from-pink-400 to-rose-500',
    },
    {
      icon: Server,
      title: 'Production Ready',
      description: 'Scalable FastAPI backend with Next.js frontend',
      color: 'from-cyan-400 to-blue-500',
    },
  ];

  const techStack = {
    frontend: [
      { name: 'Next.js 14', icon: Code },
      { name: 'TypeScript', icon: Code },
      { name: 'Framer Motion', icon: Zap },
      { name: 'Tailwind CSS', icon: Layers },
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
      value: collections.reduce((sum, c) => sum + c.vectors_count, 0).toLocaleString(),
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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-medical-blue to-medical-purple blur-3xl opacity-50" />
              <Award className="relative w-20 h-20 text-medical-blue" />
            </div>
          </motion.div>
          <h1 className="text-6xl font-bold gradient-text mb-4">MediVision AI</h1>
          <p className="text-2xl text-gray-600 mb-2">Healthcare Memory Assistant</p>
          <p className="text-lg text-gray-500">
            Built for Convolve 4.0 Hackathon • Powered by Qdrant & Azure OpenAI
          </p>
        </motion.div>

        {/* System Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <stat.icon className="w-10 h-10 text-medical-blue mx-auto mb-3" />
                </motion.div>
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Frontend */}
          <GlassCard>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Code className="w-6 h-6 text-medical-blue" />
              Frontend Stack
            </h3>
            <div className="space-y-3">
              {techStack.frontend.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <tech.icon className="w-5 h-5 text-medical-blue" />
                  <span className="font-semibold text-gray-800">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Backend */}
          <GlassCard>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Server className="w-6 h-6 text-medical-purple" />
              Backend Stack
            </h3>
            <div className="space-y-3">
              {techStack.backend.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                >
                  <tech.icon className="w-5 h-5 text-medical-purple" />
                  <span className="font-semibold text-gray-800">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Collections Info */}
        {collections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <GlassCard>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-medical-blue" />
                Vector Collections
              </h3>
              <div className="space-y-4">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-gray-800">{collection.name}</h4>
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700">
                        {collection.vectors_count.toLocaleString()} vectors
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Indexed: {collection.indexed_vectors_count.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>
                        Progress:{' '}
                        {collection.vectors_count > 0
                          ? (
                              (collection.indexed_vectors_count / collection.vectors_count) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
          <GlassCard>
            <p className="text-gray-600 mb-2">
              Built with ❤️ for Convolve 4.0 Hackathon
            </p>
            <p className="text-sm text-gray-500">
              Leveraging Qdrant Vector Search for Societal Impact in Healthcare
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <span className="text-sm font-semibold text-gray-700">
                {systemStatus?.status === 'online' ? 'System Online' : 'System Offline'}
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
