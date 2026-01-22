'use client';

import { useState } from 'react';
import { User, Clock, FileText, Activity, Brain, Search, TrendingUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ClinicalCard from '@/components/ClinicalCard';
import AnimatedButton from '@/components/AnimatedButton';

interface PatientHistory {
  timestamp: string;
  event_type: string;
  content: string;
  metadata?: Record<string, any>;
}

interface PatientSummary {
  patient_id: string;
  total_interactions: number;
  key_conditions: string[];
  medications: string[];
  recent_history: PatientHistory[];
  risk_factors: string[];
}

export default function PatientsPage() {
  const [patientId, setPatientId] = useState('');
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadPatient = async () => {
    if (!patientId.trim()) {
      toast.error('Please enter a patient ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<PatientSummary>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
      );
      setSummary(response.data);
      toast.success('Patient data loaded successfully');
    } catch (error: any) {
      console.error('Load patient error:', error);
      toast.error(error.response?.data?.detail || 'Failed to load patient data');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoPatient = () => {
    setPatientId('P001');
    setTimeout(() => {
      const demoSummary: PatientSummary = {
        patient_id: 'P001',
        total_interactions: 12,
        key_conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Asthma'],
        medications: ['Metformin 500mg', 'Lisinopril 10mg', 'Albuterol Inhaler'],
        risk_factors: ['Family history of heart disease', 'Sedentary lifestyle', 'High stress'],
        recent_history: [
          {
            timestamp: '2024-01-15T10:30:00',
            event_type: 'diagnosis',
            content: 'Routine checkup - Blood pressure elevated at 145/92',
          },
          {
            timestamp: '2024-01-10T14:15:00',
            event_type: 'prescription',
            content: 'Prescribed Lisinopril 10mg for hypertension management',
          },
          {
            timestamp: '2024-01-05T09:00:00',
            event_type: 'lab_results',
            content: 'HbA1c: 7.2% - Diabetes control fair, recommend diet adjustment',
          },
          {
            timestamp: '2023-12-20T11:45:00',
            event_type: 'follow_up',
            content: 'Follow-up visit - Patient reports improved energy levels',
          },
        ],
      };
      setSummary(demoSummary);
      toast.success('Demo patient loaded');
    }, 500);
  };

  const getEventStyle = (type: string) => {
    const styles: Record<string, { icon: any; color: string }> = {
      diagnosis: { icon: Activity, color: 'text-clinical-accent bg-clinical-accent/10 border-clinical-accent/30' },
      prescription: { icon: FileText, color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
      lab_results: { icon: TrendingUp, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
      follow_up: { icon: Clock, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    };
    return styles[type] || { icon: FileText, color: 'text-clinical-muted bg-clinical-elevated border-clinical-border' };
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container-wide section">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-clinical-accent" />
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text">Patient Memory</h1>
          </div>
          <p className="text-lg text-clinical-muted max-w-2xl mx-auto">
            Long-term patient context tracking with comprehensive medical history
          </p>
        </div>

        {/* Patient Search */}
        <ClinicalCard className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-muted" />
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleLoadPatient()}
                placeholder="Enter Patient ID (e.g., P001)"
                className="clinical-input pl-12"
              />
            </div>
            <AnimatedButton
              onClick={handleLoadPatient}
              loading={loading}
              variant="primary"
              className="px-8"
              icon={<Search className="w-4 h-4" />}
            >
              Load Patient
            </AnimatedButton>
            <AnimatedButton onClick={loadDemoPatient} variant="secondary" className="px-6">
              Demo
            </AnimatedButton>
          </div>
        </ClinicalCard>

        {/* Patient Summary */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-clinical-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-clinical-muted">Loading patient data...</p>
          </div>
        ) : summary ? (
          <div className="space-y-6">
            {/* Patient Header */}
            <ClinicalCard variant="accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-clinical-accent/10 border border-clinical-accent/30 flex items-center justify-center">
                    <User className="w-8 h-8 text-clinical-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-clinical-text">
                      Patient {summary.patient_id}
                    </h2>
                    <p className="text-clinical-muted">
                      {summary.total_interactions} total interactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-bold text-clinical-accent">
                    {summary.total_interactions}
                  </div>
                  <div className="text-sm text-clinical-muted">Visits</div>
                </div>
              </div>
            </ClinicalCard>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Key Conditions */}
              <ClinicalCard>
                <h3 className="text-lg font-display font-semibold text-clinical-text mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-clinical-accent" />
                  Key Conditions
                </h3>
                <div className="space-y-2">
                  {summary.key_conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-clinical-accent/10 border border-clinical-accent/20 rounded-lg text-sm text-clinical-text"
                    >
                      {condition}
                    </div>
                  ))}
                </div>
              </ClinicalCard>

              {/* Medications */}
              <ClinicalCard>
                <h3 className="text-lg font-display font-semibold text-clinical-text mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Medications
                </h3>
                <div className="space-y-2">
                  {summary.medications.map((med, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-purple-400/10 border border-purple-400/20 rounded-lg text-sm text-clinical-text"
                    >
                      {med}
                    </div>
                  ))}
                </div>
              </ClinicalCard>

              {/* Risk Factors */}
              <ClinicalCard>
                <h3 className="text-lg font-display font-semibold text-clinical-text mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-clinical-coral" />
                  Risk Factors
                </h3>
                <div className="space-y-2">
                  {summary.risk_factors.map((risk, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-rose-400/10 border border-rose-400/20 rounded-lg text-sm text-clinical-text"
                    >
                      {risk}
                    </div>
                  ))}
                </div>
              </ClinicalCard>
            </div>

            {/* Timeline */}
            <ClinicalCard>
              <h3 className="text-xl font-display font-bold text-clinical-text mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-clinical-accent" />
                Medical History Timeline
              </h3>
              <div className="space-y-4">
                {summary.recent_history.map((event, index) => {
                  const style = getEventStyle(event.event_type);
                  const Icon = style.icon;
                  return (
                    <div
                      key={index}
                      className="relative pl-8 pb-6 border-l-2 border-clinical-border last:border-0 last:pb-0"
                    >
                      <div className={`absolute left-0 -translate-x-1/2 w-10 h-10 rounded-full border flex items-center justify-center ${style.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-clinical-text capitalize">
                            {event.event_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-clinical-muted">
                            {new Date(event.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-clinical-muted">{event.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ClinicalCard>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-clinical-elevated border border-clinical-border flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-clinical-muted" />
            </div>
            <h3 className="text-2xl font-display font-bold text-clinical-text mb-2">No Patient Data</h3>
            <p className="text-clinical-muted max-w-md mx-auto mb-6">
              Enter a patient ID to view their comprehensive medical history and memory
            </p>
            <AnimatedButton onClick={loadDemoPatient} variant="secondary">
              Load Demo Patient
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
}
