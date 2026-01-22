'use client';

import { useState } from 'react';
import { Pill, CheckCircle, Sparkles, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ClinicalCard from '@/components/ClinicalCard';
import AnimatedButton from '@/components/AnimatedButton';
import ReactMarkdown from 'react-markdown';

interface Evidence {
  content: string;
  score?: number;
  source?: string;
  [key: string]: any;
}

interface TreatmentResponse {
  patient_id: string;
  recommendations: string;
  evidence: Evidence[];
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
          patient_id: 'DEMO_P001',
          diagnosis: `${diagnosis}${patientContext ? `. Patient context: ${patientContext}` : ''}`,
          contraindications: [],
        }
      );
      setTreatment(response.data);
      toast.success('Treatment recommendations generated');
    } catch (error: any) {
      console.error('Treatment error:', error);
      const errorMsg = typeof error.response?.data?.detail === 'string'
        ? error.response.data.detail
        : 'Failed to generate recommendations';
      toast.error(errorMsg);
      setTreatment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container-wide section">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Pill className="w-10 h-10 text-clinical-coral" />
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text">Treatment Recommendations</h1>
          </div>
          <p className="text-lg text-clinical-muted max-w-2xl mx-auto">
            Evidence-based treatment plans with safety warnings and alternatives
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Diagnosis Input */}
          <ClinicalCard>
            <label className="block text-sm font-semibold text-clinical-text mb-3">
              Diagnosis <span className="text-clinical-coral">*</span>
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter primary diagnosis..."
              className="clinical-input resize-none"
              rows={4}
            />
          </ClinicalCard>

          {/* Patient Context */}
          <ClinicalCard>
            <label className="block text-sm font-semibold text-clinical-text mb-3">
              Patient Context (Optional)
            </label>
            <textarea
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
              placeholder="Age, comorbidities, medications, allergies..."
              className="clinical-input resize-none"
              rows={4}
            />
          </ClinicalCard>
        </div>

        {/* Actions */}
        <ClinicalCard className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm text-clinical-muted">Quick scenarios:</span>
              {demoScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => loadDemo(scenario)}
                  className="px-3 py-1 bg-clinical-coral/10 hover:bg-clinical-coral/20 border border-clinical-coral/30 hover:border-clinical-coral rounded-full text-sm text-clinical-coral transition-all duration-200"
                >
                  {scenario.name}
                </button>
              ))}
            </div>
            <AnimatedButton
              onClick={handleGetRecommendations}
              loading={loading}
              variant="primary"
              className="px-8"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Generate Recommendations
            </AnimatedButton>
          </div>
        </ClinicalCard>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-clinical-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-clinical-muted">Analyzing treatment options...</p>
          </div>
        ) : treatment ? (
          <div className="space-y-6">
            {/* Main Recommendations */}
            <ClinicalCard variant="accent">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-display font-bold text-clinical-text">
                  Treatment Recommendations
                </h2>
              </div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{treatment.recommendations}</ReactMarkdown>
              </div>
            </ClinicalCard>

            {/* Evidence */}
            {treatment.evidence && treatment.evidence.length > 0 && (
              <ClinicalCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-clinical-text">
                    Supporting Evidence
                  </h3>
                </div>
                <div className="space-y-4">
                  {treatment.evidence.map((item, index) => {
                    const score = item.score ?? 0.8;
                    return (
                      <div
                        key={index}
                        className="p-4 bg-purple-400/10 border border-purple-400/20 rounded-xl"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-clinical-elevated rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-400 transition-all duration-500"
                                style={{ width: `${score * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-clinical-muted">
                              {(score * 100).toFixed(0)}%
                            </span>
                          </div>
                          {item.source && (
                            <span className="text-xs text-clinical-muted">{item.source}</span>
                          )}
                        </div>
                        <p className="text-clinical-muted">{item.content}</p>
                      </div>
                    );
                  })}
                </div>
              </ClinicalCard>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-clinical-elevated border border-clinical-border flex items-center justify-center mx-auto mb-6">
              <Pill className="w-10 h-10 text-clinical-muted" />
            </div>
            <h3 className="text-2xl font-display font-bold text-clinical-text mb-2">
              Get Treatment Recommendations
            </h3>
            <p className="text-clinical-muted max-w-md mx-auto mb-6">
              Enter a diagnosis and patient context to receive evidence-based treatment
              recommendations with safety warnings
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
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
          </div>
        )}
      </div>
    </div>
  );
}
