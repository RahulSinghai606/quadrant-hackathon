'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';
import { FaStethoscope, FaBrain, FaChartLine, FaShieldAlt, FaRocket, FaHeart } from 'react-icons/fa';

const features = [
  {
    icon: FaStethoscope,
    title: 'AI-Powered Diagnosis',
    description: 'Evidence-based medical diagnosis with source citations',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FaBrain,
    title: 'Long-term Memory',
    description: 'Persistent patient history with semantic retrieval',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: FaChartLine,
    title: 'Smart Analytics',
    description: 'Advanced insights from medical data patterns',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: FaShieldAlt,
    title: 'Privacy First',
    description: 'HIPAA-compliant security and data protection',
    gradient: 'from-red-500 to-orange-500',
  },
];

const stats = [
  { value: '400M+', label: 'People Served' },
  { value: '<200ms', label: 'Search Speed' },
  { value: '95%', label: 'Accuracy' },
  { value: '24/7', label: 'Availability' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-blue/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-purple/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="px-6 py-2 bg-medical-gradient rounded-full text-white text-sm font-semibold shadow-xl">
                🚀 Powered by Qdrant Vector Search
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
              MediVision AI
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto"
            >
              Advanced Healthcare Memory Assistant with{' '}
              <span className="gradient-text font-semibold">Multimodal Medical Intelligence</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto"
            >
              Combining vector search, long-term memory, and evidence-based reasoning
              to revolutionize healthcare access for underserved communities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center"
            >
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
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <GlassCard className="text-center" hover={false}>
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Production-grade AI healthcare system with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <GlassCard className="h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center medical-glow"
          >
            <FaHeart className="text-6xl text-medical-pink mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join us in making quality healthcare accessible to everyone.
              Experience the future of medical intelligence.
            </p>
            <Link href="/diagnosis">
              <AnimatedButton variant="primary" icon={<FaStethoscope />}>
                Get Started Now
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/20 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600">
            Built with ❤️ for Convolve 4.0 Hackathon
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Powered by Qdrant 🚀 Azure GPT-4o 🧠 Next.js ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}
