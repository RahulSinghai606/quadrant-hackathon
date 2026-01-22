'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, AlertTriangle, CheckCircle, Info, Sparkles, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import ReactMarkdown from 'react-markdown';

interface Evidence {
  content: string;
  score: number;
  source: string;
}

interface TreatmentResponse {
  recommendations: string;
  evidence: Evidence[];
  warnings: string[];
  alternatives: string[];
}

export default function TreatmentPage() {
  const [diagnosis, setDiagnosis] = useState('');
  const [patientContext, setPatientContext] = useState('');
  const [treatment, setTreatment] = useState<TreatmentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const demoScenarios = [
    {
      id: 'T001',
      name: 'Type 2 Diabetes',
      diagnosis: 'Type 2 Diabetes Mellitus with HbA1c 8.2%',
      context: 'Adult patient, BMI 32, sedentary lifestyle, no complications',
    },
    {
      id: 'T002',
      name: 'Hypertension',
      diagnosis: 'Primary Hypertension, Stage 2 (BP 165/98)',
      context: 'Middle-aged patient, family history of CVD, mild obesity',
    },
    {
      id: 'T003',
      name: 'Community Pneumonia',
      diagnosis: 'Community-Acquired Pneumonia, moderate severity',
      context: 'Adult patient, no comorbidities, normal immune function',
    },
  ];

  const loadDemo = (scenario: (typeof demoScenarios)[0]) => {
    setDiagnosis(scenario.diagnosis);
    setPatientContext(scenario.context);
    toast.success(`Loaded ${scenario.name} scenario`);
  };

  const handleGetRecommendations = async () => {
    if (!diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<TreatmentResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/treatment`,
        {
          diagnosis,
          patient_context: patientContext,
        }
      );
      setTreatment(response.data);
      toast.success('Treatment recommendations generated');
    } catch (error: any) {
      console.error('Treatment error:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate recommendations');
      setTreatment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Pill className="w-12 h-12 text-medical-pink" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text">Treatment Recommendations</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evidence-based treatment plans with safety warnings and alternatives
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Diagnosis Input */}
          <GlassCard delay={0.1}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter primary diagnosis..."
              className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-pink/50 text-gray-800 placeholder-gray-500 resize-none"
              rows={4}
            />
          </GlassCard>

          {/* Patient Context */}
          <GlassCard delay={0.2}>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Patient Context (Optional)
            </label>
            <textarea
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
              placeholder="Age, comorbidities, medications, allergies..."
              className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-pink/50 text-gray-800 placeholder-gray-500 resize-none"
              rows={4}
            />
          </GlassCard>
        </div>

        {/* Actions */}
        <GlassCard delay={0.3} className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">Quick scenarios:</span>
              {demoScenarios.map((scenario) => (
                <motion.button
                  key={scenario.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadDemo(scenario)}
                  className="px-3 py-1 bg-medical-pink/10 hover:bg-medical-pink/20 rounded-full text-sm text-medical-pink transition-colors"
                >
                  {scenario.name}
                </motion.button>
              ))}
            </div>
            <AnimatedButton
              onClick={handleGetRecommendations}
              loading={loading}
              variant="primary"
              className="px-8"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Recommendations
            </AnimatedButton>
          </div>
        </GlassCard>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Sparkles className="w-12 h-12 text-medical-pink" />
              </motion.div>
              <p className="mt-4 text-gray-600">Analyzing treatment options...</p>
            </motion.div>
          ) : treatment ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Warnings */}
              {treatment.warnings && treatment.warnings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard className="border-2 border-red-200">
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-red-700 mb-3">
                          Important Warnings
                        </h3>
                        <ul className="space-y-2">
                          {treatment.warnings.map((warning, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.1 }}
                              className="flex items-start gap-2 text-red-700"
                            >
                              <span className="text-red-500 mt-1">•</span>
                              <span>{warning}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Main Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Treatment Recommendations
                    </h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <ReactMarkdown>{treatment.recommendations}</ReactMarkdown>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Alternatives */}
              {treatment.alternatives && treatment.alternatives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlassCard>
                    <div className="flex items-center gap-3 mb-6">
                      <Info className="w-8 h-8 text-blue-500" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Alternative Options
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {treatment.alternatives.map((alt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="p-4 bg-blue-50 rounded-xl text-gray-700"
                        >
                          {alt}
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Evidence */}
              {treatment.evidence && treatment.evidence.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassCard>
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-8 h-8 text-medical-purple" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Supporting Evidence
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {treatment.evidence.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="p-4 bg-purple-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.score * 100}%` }}
                                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                  className="h-full bg-gradient-to-r from-medical-purple to-medical-pink"
                                />
                              </div>
                              <span className="text-xs font-mono text-gray-600">
                                {(item.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{item.source}</span>
                          </div>
                          <p className="text-gray-700">{item.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Pill className="w-20 h-20 text-medical-pink/30 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Get Treatment Recommendations
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Enter a diagnosis and patient context to receive evidence-based treatment
                recommendations with safety warnings
              </p>
              <div className="flex gap-3 justify-center">
                {demoScenarios.map((scenario) => (
                  <AnimatedButton
                    key={scenario.id}
                    onClick={() => loadDemo(scenario)}
                    variant="secondary"
                  >
                    {scenario.name}
                  </AnimatedButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
