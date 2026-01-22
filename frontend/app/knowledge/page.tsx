'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, FileText, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';

interface SearchResult {
  content: string;
  score: number;
  metadata: {
    source?: string;
    category?: string;
    [key: string]: any;
  };
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
}

export default function KnowledgePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<SearchResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search`,
        { query, top_k: 5 }
      );
      setResults(response.data.results);
      toast.success(`Found ${response.data.results.length} relevant results`);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.detail || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      disease: 'from-red-400 to-pink-500',
      symptom: 'from-orange-400 to-yellow-500',
      treatment: 'from-green-400 to-emerald-500',
      diagnosis: 'from-blue-400 to-indigo-500',
      medication: 'from-purple-400 to-violet-500',
    };
    return colors[category?.toLowerCase() || ''] || 'from-gray-400 to-slate-500';
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Book className="w-12 h-12 text-medical-blue" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text">
              Medical Knowledge Search
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through our comprehensive medical knowledge base powered by vector search
          </p>
        </motion.div>

        {/* Search Bar */}
        <GlassCard delay={0.2} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search medical conditions, symptoms, treatments..."
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue/50 text-gray-800 placeholder-gray-500"
              />
            </div>
            <AnimatedButton
              onClick={handleSearch}
              loading={loading}
              variant="primary"
              className="px-8"
            >
              Search
            </AnimatedButton>
          </div>

          {/* Quick Queries */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick searches:</span>
            {[
              'diabetes symptoms',
              'hypertension treatment',
              'migraine causes',
              'pneumonia diagnosis',
            ].map((q) => (
              <motion.button
                key={q}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuery(q)}
                className="px-3 py-1 bg-medical-blue/10 hover:bg-medical-blue/20 rounded-full text-sm text-medical-blue transition-colors"
              >
                {q}
              </motion.button>
            ))}
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
                <Sparkles className="w-12 h-12 text-medical-blue" />
              </motion.div>
              <p className="mt-4 text-gray-600">Searching medical knowledge base...</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Search Results ({results.length})
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Results ranked by relevance</span>
                </div>
              </div>

              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover className="relative overflow-hidden">
                    {/* Category Badge */}
                    {result.metadata.category && (
                      <div className="absolute top-4 right-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(
                            result.metadata.category
                          )}`}
                        >
                          {result.metadata.category}
                        </motion.div>
                      </div>
                    )}

                    {/* Relevance Score */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-medical-blue" />
                        <span className="text-sm font-semibold text-gray-700">
                          Result #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score * 100}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-medical-blue to-medical-purple"
                          />
                        </div>
                        <span className="text-xs font-mono text-gray-600">
                          {(result.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 leading-relaxed mb-4">{result.content}</p>

                    {/* Metadata */}
                    {result.metadata.source && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-200/50">
                        <Book className="w-4 h-4" />
                        <span>Source: {result.metadata.source}</span>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          ) : query && !loading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-600">Try different keywords or search terms</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Empty State */}
        {!query && results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Book className="w-20 h-20 text-medical-blue/30 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Search Medical Knowledge
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a medical query to search through our comprehensive knowledge base powered by
              vector search
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
