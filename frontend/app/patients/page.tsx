'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, FileText, Activity, Brain, Search, TrendingUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
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

  const getEventIcon = (type: string) => {
    const icons: Record<string, any> = {
      diagnosis: Activity,
      prescription: FileText,
      lab_results: TrendingUp,
      follow_up: Clock,
    };
    return icons[type] || FileText;
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      diagnosis: 'from-blue-400 to-indigo-500',
      prescription: 'from-purple-400 to-violet-500',
      lab_results: 'from-green-400 to-emerald-500',
      follow_up: 'from-orange-400 to-yellow-500',
    };
    return colors[type] || 'from-gray-400 to-slate-500';
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Brain className="w-12 h-12 text-medical-purple" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text">Patient Memory</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Long-term patient context tracking with comprehensive medical history
          </p>
        </motion.div>

        {/* Patient Search */}
        <GlassCard delay={0.2} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleLoadPatient()}
                placeholder="Enter Patient ID (e.g., P001)"
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-purple/50 text-gray-800 placeholder-gray-500"
              />
            </div>
            <AnimatedButton
              onClick={handleLoadPatient}
              loading={loading}
              variant="primary"
              className="px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Load Patient
            </AnimatedButton>
            <AnimatedButton onClick={loadDemoPatient} variant="secondary" className="px-6">
              Demo
            </AnimatedButton>
          </div>
        </GlassCard>

        {/* Patient Summary */}
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
                <Brain className="w-12 h-12 text-medical-purple" />
              </motion.div>
              <p className="mt-4 text-gray-600">Loading patient data...</p>
            </motion.div>
          ) : summary ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Patient Header */}
              <GlassCard hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-medical-purple to-medical-pink flex items-center justify-center"
                    >
                      <User className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Patient {summary.patient_id}
                      </h2>
                      <p className="text-gray-600">
                        {summary.total_interactions} total interactions
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-right"
                  >
                    <div className="text-3xl font-bold gradient-text">
                      {summary.total_interactions}
                    </div>
                    <div className="text-sm text-gray-600">Visits</div>
                  </motion.div>
                </div>
              </GlassCard>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Key Conditions */}
                <GlassCard hover delay={0.1}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-medical-blue" />
                    Key Conditions
                  </h3>
                  <div className="space-y-2">
                    {summary.key_conditions.map((condition, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-gray-700"
                      >
                        {condition}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Medications */}
                <GlassCard hover delay={0.2}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-medical-purple" />
                    Medications
                  </h3>
                  <div className="space-y-2">
                    {summary.medications.map((med, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-2 bg-purple-50 rounded-lg text-sm text-gray-700"
                      >
                        {med}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Risk Factors */}
                <GlassCard hover delay={0.3}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-medical-red" />
                    Risk Factors
                  </h3>
                  <div className="space-y-2">
                    {summary.risk_factors.map((risk, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-2 bg-red-50 rounded-lg text-sm text-gray-700"
                      >
                        {risk}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Timeline */}
              <GlassCard>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-medical-blue" />
                  Medical History Timeline
                </h3>
                <div className="space-y-4">
                  {summary.recent_history.map((event, index) => {
                    const Icon = getEventIcon(event.event_type);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0 last:pb-0"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                          className={`absolute left-0 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${getEventColor(
                            event.event_type
                          )} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="ml-6">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-gray-700 capitalize">
                              {event.event_type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-gray-700">{event.content}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
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
                <Brain className="w-20 h-20 text-medical-purple/30 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Patient Data</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Enter a patient ID to view their comprehensive medical history and memory
              </p>
              <AnimatedButton onClick={loadDemoPatient} variant="secondary">
                Load Demo Patient
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
