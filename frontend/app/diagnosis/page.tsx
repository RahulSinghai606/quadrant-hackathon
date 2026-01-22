'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ClinicalCard from '@/components/ClinicalCard';
import AnimatedButton from '@/components/AnimatedButton';
import { FaStethoscope, FaUser, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
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

      <div className="container-wide section">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            <span className="text-clinical-accent">🩺</span> Medical Diagnosis
          </h1>
          <p className="text-clinical-muted text-lg">
            AI-powered diagnosis with evidence-based reasoning
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <ClinicalCard>
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-clinical-accent" />
                Patient Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-clinical-muted mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="clinical-input"
                    placeholder="Enter patient identifier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-clinical-muted mb-2">
                    Symptoms Description
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={6}
                    className="clinical-input resize-none"
                    placeholder="Describe patient symptoms in detail..."
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={useHistory}
                    onChange={(e) => setUseHistory(e.target.checked)}
                    className="w-5 h-5 rounded bg-clinical-elevated border-clinical-border text-clinical-accent focus:ring-clinical-accent focus:ring-offset-clinical-bg"
                  />
                  <span className="text-sm text-clinical-muted group-hover:text-clinical-text transition-colors">
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
            </ClinicalCard>

            {/* Demo Scenarios */}
            <ClinicalCard>
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <FaClipboardList className="text-clinical-accent" />
                Demo Scenarios
              </h2>

              <div className="space-y-2">
                {demoScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => loadDemoScenario(scenario)}
                    className="w-full text-left p-4 rounded-xl border border-clinical-border bg-clinical-elevated hover:border-clinical-accent hover:bg-clinical-accent/5 transition-all duration-200 group"
                  >
                    <div className="font-semibold text-clinical-accent mb-1 group-hover:text-cyan-400">
                      {scenario.id}: {scenario.name}
                    </div>
                    <div className="text-sm text-clinical-muted line-clamp-2">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </ClinicalCard>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {diagnosis ? (
              <>
                <ClinicalCard variant="accent">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <FaCheckCircle className="text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-display font-semibold">Diagnosis Result</h2>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{diagnosis}</ReactMarkdown>
                  </div>
                </ClinicalCard>

                {evidence.length > 0 && (
                  <ClinicalCard>
                    <h2 className="text-lg font-display font-semibold mb-4">
                      📚 Retrieved Medical Evidence
                    </h2>

                    <div className="space-y-3">
                      {evidence.slice(0, 3).map((ev, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-clinical-elevated border border-clinical-border"
                        >
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="font-semibold text-clinical-accent text-sm">
                              {ev.title}
                            </h3>
                            <span className="tag shrink-0">
                              {ev.relevance_score?.toFixed(3)}
                            </span>
                          </div>
                          <p className="text-sm text-clinical-muted line-clamp-3">
                            {ev.content}
                          </p>
                          {(ev.category || ev.specialty) && (
                            <div className="flex gap-2 mt-3">
                              {ev.category && (
                                <span className="tag-warm">{ev.category}</span>
                              )}
                              {ev.specialty && (
                                <span className="tag-coral">{ev.specialty}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ClinicalCard>
                )}
              </>
            ) : (
              <ClinicalCard className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-clinical-elevated border border-clinical-border flex items-center justify-center mb-4">
                  <FaStethoscope className="text-3xl text-clinical-muted" />
                </div>
                <p className="text-clinical-muted text-lg mb-2">
                  Enter patient symptoms and click "Generate Diagnosis"
                </p>
                <p className="text-clinical-muted/60 text-sm">
                  or load a demo scenario to get started
                </p>
              </ClinicalCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
