'use client';

import { useState } from 'react';
import { Search, Book, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ClinicalCard from '@/components/ClinicalCard';
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

  const getCategoryStyle = (category?: string) => {
    const styles: Record<string, string> = {
      disease: 'tag-coral',
      symptom: 'tag-warm',
      treatment: 'tag-success',
      diagnosis: 'tag',
      medication: 'tag',
    };
    return styles[category?.toLowerCase() || ''] || 'tag';
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container-wide section">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-10 h-10 text-clinical-accent" />
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Medical Knowledge Search
            </h1>
          </div>
          <p className="text-lg text-clinical-muted max-w-2xl mx-auto">
            Search through our comprehensive medical knowledge base powered by vector search
          </p>
        </div>

        {/* Search Bar */}
        <ClinicalCard className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search medical conditions, symptoms, treatments..."
                className="clinical-input pl-12"
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
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-clinical-muted">Quick searches:</span>
            {[
              'diabetes symptoms',
              'hypertension treatment',
              'migraine causes',
              'pneumonia diagnosis',
            ].map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="px-3 py-1 bg-clinical-accent/10 hover:bg-clinical-accent/20 border border-clinical-accent/30 hover:border-clinical-accent rounded-full text-sm text-clinical-accent transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>
        </ClinicalCard>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-clinical-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-clinical-muted">Searching medical knowledge base...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-clinical-text">
                Search Results ({results.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-clinical-muted">
                <AlertCircle className="w-4 h-4" />
                <span>Results ranked by relevance</span>
              </div>
            </div>

            {results.map((result, index) => (
              <ClinicalCard key={index} className="relative overflow-hidden">
                {/* Category Badge */}
                {result.metadata?.category && (
                  <div className="absolute top-4 right-4">
                    <span className={getCategoryStyle(result.metadata.category)}>
                      {result.metadata.category}
                    </span>
                  </div>
                )}

                {/* Relevance Score */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-clinical-accent" />
                    <span className="text-sm font-semibold text-clinical-text">
                      Result #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-clinical-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-clinical-accent transition-all duration-500"
                        style={{ width: `${result.score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-clinical-muted">
                      {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-clinical-muted leading-relaxed mb-4">{result.content}</p>

                {/* Metadata */}
                {result.metadata?.source && (
                  <div className="flex items-center gap-2 text-sm text-clinical-muted/60 pt-4 border-t border-clinical-border">
                    <Book className="w-4 h-4" />
                    <span>Source: {result.metadata.source}</span>
                  </div>
                )}
              </ClinicalCard>
            ))}
          </div>
        ) : query && !loading ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-clinical-muted/30 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-clinical-text mb-2">No results found</h3>
            <p className="text-clinical-muted">Try different keywords or search terms</p>
          </div>
        ) : null}

        {/* Empty State */}
        {!query && results.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-clinical-elevated border border-clinical-border flex items-center justify-center mx-auto mb-6">
              <Book className="w-10 h-10 text-clinical-muted" />
            </div>
            <h3 className="text-2xl font-display font-bold text-clinical-text mb-2">
              Search Medical Knowledge
            </h3>
            <p className="text-clinical-muted max-w-md mx-auto">
              Enter a medical query to search through our comprehensive knowledge base powered by
              vector search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
