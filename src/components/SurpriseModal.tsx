import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, RefreshCw, Play, ArrowRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentItem, RecommendationScoreResult } from '../types';
import { TrailerModal } from './TrailerModal';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [surpriseData, setSurpriseData] = useState<{
    surpriseQuery: any;
    match: RecommendationScoreResult;
  } | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchSurprise = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations/surprise');
      if (res.ok) {
        const data = await res.json();
        setSurpriseData(data);

        // Fire celebration confetti
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'],
        });
      }
    } catch (err) {
      console.error('Failed to fetch surprise:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSurprise();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const match = surpriseData?.match;
  const content = match?.content;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 text-slate-100 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between relative z-10 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎲</span>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-wide">
                  Surprise Recommendation
                </h3>
                <p className="text-xs text-purple-300">Curated AI Discovery</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading || !content ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-sm text-slate-300 font-medium">Rolling the anime & manga universe for you...</p>
            </div>
          ) : (
            <div className="relative z-10 py-6">
              {/* Random Mood Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Mood: {surpriseData.surpriseQuery.mood}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Situation: {surpriseData.surpriseQuery.situation}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Energy: {surpriseData.surpriseQuery.state}
                </span>
              </div>

              {/* Main Card */}
              <div className="flex flex-col sm:flex-row gap-5 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full sm:w-36 h-52 object-cover rounded-xl shadow-lg flex-shrink-0"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                        {content.contentType} • {content.country}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        ⭐ {content.rating}
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-white leading-tight mb-2">
                      {content.title}
                    </h4>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs font-extrabold text-pink-400 bg-pink-500/15 px-2.5 py-1 rounded-full border border-pink-500/30">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {match.finalScore}% Mood Match
                      </span>
                      <span className="text-xs text-slate-400">{content.releaseYear} • {content.status}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {content.description}
                    </p>
                  </div>

                  {/* AI reason */}
                  {match.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/50 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <p className="italic">{match.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={fetchSurprise}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Roll Again 🎲</span>
                </button>

                <div className="flex items-center gap-2">
                  {content.trailer?.available && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Trailer</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/${content.contentType}/${content.contentId}`);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition"
                  >
                    <span>View Title</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {content && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          title={content.title}
          youtubeId={content.trailer?.youtubeId}
          embedUrl={content.trailer?.embedUrl}
        />
      )}
    </>
  );
};
