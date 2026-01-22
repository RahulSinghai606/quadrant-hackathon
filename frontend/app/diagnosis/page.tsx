'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import { FaStethoscope, FaUser, FaClipboardList, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const demoScenarios = [
  {
    id: 'S001',
    name: 'Pneumonia',
    description: 'Patient reports productive cough with yellow sputum, fever (39°C), shortness of breath, and chest pain when breathing deeply. Symptoms started 4 days ago.',
  },
  {
    id: 'S002',
    name: 'Migraine',
    description: 'Patient complains of severe unilateral throbbing headache lasting 6 hours, associated with nausea and sensitivity to light and sound. Has history of similar episodes monthly.',
  },
  {
    id: 'S003',
    name: 'Diabetes',
    description: 'Patient reports increased thirst, frequent urination (especially at night), unexplained weight loss of 15 lbs in 2 months, and persistent fatigue. No fever.',
  },
];

interface Evidence {
  title: string;
  content: string;
  relevance_score: number;
  category?: string;
  specialty?: string;
}

export default function DiagnosisPage() {
  const [patientId, setPatientId] = useState('DEMO_P001');
  const [symptoms, setSymptoms] = useState('');
  const [useHistory, setUseHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [evidence, setEvidence] = useState<Evidence[]>([]);

  const loadDemoScenario = (scenario: typeof demoScenarios[0]) => {
    setPatientId('DEMO_P001');
    setSymptoms(scenario.description);
    toast.success(`Loaded ${scenario.name} scenario`);
  };

  const handleDiagnose = async () => {
    if (!patientId || !symptoms) {
      toast.error('Please provide Patient ID and symptoms');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diagnose`, {
        patient_id: patientId,
        symptoms,
        use_history: useHistory,
      });

      setDiagnosis(response.data.diagnosis);
      setEvidence(response.data.evidence);
      toast.success('Diagnosis complete!');
    } catch (error: any) {
      console.error('Diagnosis error:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            🩺 Medical Diagnosis
          </h1>
          <p className="text-slate-600 text-lg">
            AI-powered diagnosis with evidence-based reasoning
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <GlassCard delay={0.1}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUser className="text-medical-blue" />
                Patient Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 outline-none transition-all"
                    placeholder="Enter patient identifier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Symptoms Description
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 outline-none transition-all resize-none"
                    placeholder="Describe patient symptoms in detail..."
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useHistory}
                    onChange={(e) => setUseHistory(e.target.checked)}
                    className="w-5 h-5 text-medical-blue rounded focus:ring-medical-blue"
                  />
                  <span className="text-sm text-slate-700">
                    Use patient medical history in analysis
                  </span>
                </label>

                <AnimatedButton
                  onClick={handleDiagnose}
                  loading={loading}
                  disabled={loading}
                  icon={<FaStethoscope />}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Generate Diagnosis'}
                </AnimatedButton>
              </div>
            </GlassCard>

            {/* Demo Scenarios */}
            <GlassCard delay={0.2}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaClipboardList className="text-medical-purple" />
                Quick Load Demo Scenarios
              </h2>

              <div className="space-y-2">
                {demoScenarios.map((scenario, index) => (
                  <motion.button
                    key={scenario.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => loadDemoScenario(scenario)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-medical-blue transition-all"
                  >
                    <div className="font-semibold text-medical-blue mb-1">
                      {scenario.id}: {scenario.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {scenario.description.slice(0, 100)}...
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {diagnosis ? (
                <motion.div
                  key="diagnosis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GlassCard delay={0}>
                    <div className="flex items-center gap-2 mb-4">
                      <FaCheckCircle className="text-green-500 text-2xl" />
                      <h2 className="text-xl font-bold">Diagnosis Result</h2>
                    </div>

                    <div className="prose prose-slate max-w-none">
                      <ReactMarkdown>{diagnosis}</ReactMarkdown>
                    </div>
                  </GlassCard>

                  {evidence.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6"
                    >
                      <GlassCard delay={0}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                          📚 Retrieved Medical Evidence
                        </h2>

                        <div className="space-y-4">
                          {evidence.slice(0, 3).map((ev, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-xl bg-white/50 border border-slate-200"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-medical-blue">
                                  {ev.title}
                                </h3>
                                <span className="px-3 py-1 rounded-full bg-medical-gradient text-white text-xs font-semibold">
                                  Score: {ev.relevance_score?.toFixed(3)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-3">
                                {ev.content}
                              </p>
                              {(ev.category || ev.specialty) && (
                                <div className="flex gap-2 mt-2">
                                  {ev.category && (
                                    <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs">
                                      {ev.category}
                                    </span>
                                  )}
                                  {ev.specialty && (
                                    <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs">
                                      {ev.specialty}
                                    </span>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard delay={0.3}>
                    <div className="text-center py-12">
                      <FaStethoscope className="text-6xl text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">
                        Enter patient symptoms and click "Generate Diagnosis"
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        or load a demo scenario to get started
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
