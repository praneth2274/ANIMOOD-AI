import React from 'react';
import { X, Sparkles, BarChart3, Info } from 'lucide-react';
import { RecommendationScoreResult } from '../types';

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RecommendationScoreResult;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const { content, finalScore, breakdown, explanation } = result;

  const factors = [
    {
      name: 'Mood Match',
      weight: '25%',
      score: breakdown.moodMatch,
      max: 25,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      description: 'Alignment with your emotional headspace and tone preferences.',
    },
    {
      name: 'Genre Match',
      weight: '20%',
      score: breakdown.genreMatch,
      max: 20,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      description: 'Overlap with requested genres (Action, Romance, Sci-Fi, etc.).',
    },
    {
      name: 'Situation Match',
      weight: '15%',
      score: breakdown.situationMatch,
      max: 15,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Pacing suitability for your setting (After College, Before Sleep, etc.).',
    },
    {
      name: 'Energy State Match',
      weight: '10%',
      score: breakdown.stateMatch,
      max: 10,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      description: 'Mental exertion match (High Energy, Relaxed, Focused).',
    },
    {
      name: 'User History & Taste',
      weight: '15%',
      score: breakdown.historyMatch,
      max: 15,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      description: 'Affinity with your saved favorites, watchlist, and ratings.',
    },
    {
      name: 'Rating & Global Popularity',
      weight: '10%',
      score: breakdown.popularityRating,
      max: 10,
      color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
      description: 'Community reviews score and global fanbase engagement.',
    },
    {
      name: 'Language & Accessibility',
      weight: '5%',
      score: breakdown.languageMatch,
      max: 5,
      color: 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
      description: 'Regional language audio availability and subtitle localization.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Recommendation Score Matrix
              </h3>
              <p className="text-xs text-slate-400">7-Factor Weighted Algorithm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Item Summary */}
        <div className="flex items-center gap-4 py-4 border-b border-slate-800/80">
          <img
            src={content.image}
            alt={content.title}
            className="w-14 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-400 uppercase tracking-wider mb-1">
              {content.contentType} • {content.country}
            </span>
            <h4 className="text-base font-bold text-white truncate">{content.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                {finalScore}%
              </span>
              <span className="text-xs text-slate-400">Overall Mood Affinity</span>
            </div>
          </div>
        </div>

        {/* AI Explanation Pill */}
        {explanation && (
          <div className="my-4 p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-300">AniMood AI Insight: </span>
              {explanation}
            </div>
          </div>
        )}

        {/* Factor Bars */}
        <div className="space-y-3.5 my-4">
          {factors.map((factor) => {
            const percentage = Math.min(100, (factor.score / factor.max) * 100);
            return (
              <div key={factor.name} className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-200">{factor.name}</span>
                    <span className="text-[10px] text-slate-400">({factor.weight})</span>
                  </div>
                  <div className="font-bold text-slate-300">
                    {factor.score.toFixed(1)} / {factor.max} pts
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${factor.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{factor.description}</p>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Calculated dynamically based on real-time mood input vector and content telemetry.</span>
        </div>
      </div>
    </div>
  );
};
