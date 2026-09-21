import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  Calendar,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Smile,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MoodHistoryEntry, MoodType } from '../types';

export const MoodHistoryPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<MoodHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (token) {
          const res = await fetch('/api/user/mood-history', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setHistory(data.history || []);
          }
        } else {
          // Check local stored session searches if not signed in
          const localStored = localStorage.getItem('animood_guest_history');
          if (localStored) {
            setHistory(JSON.parse(localStored));
          } else {
            // Default demo entries to demonstrate functionality
            setHistory([
              {
                id: 'demo-1',
                timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
                mood: 'Motivated',
                situation: 'After College',
                state: 'High Energy',
                recommendationsCount: 5,
                topPickTitle: 'Solo Leveling',
              },
              {
                id: 'demo-2',
                timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
                mood: 'Relaxed',
                situation: 'Before Sleep',
                state: 'Low Energy',
                recommendationsCount: 4,
                topPickTitle: 'Frieren: Beyond Journey\'s End',
              },
              {
                id: 'demo-3',
                timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
                mood: 'Curious',
                situation: 'Weekend',
                state: 'Focused',
                recommendationsCount: 6,
                topPickTitle: 'Link Click',
              },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  // Compute mood frequencies
  const moodCounts = history.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  const totalEntries = history.length;

  const handleRerun = (entry: MoodHistoryEntry) => {
    navigate(`/discover?presetMood=${encodeURIComponent(entry.mood)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-purple-400" />
              <h1 className="text-3xl font-black text-white">Your Mood Discovery Timeline</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Review your emotional states over time and re-run your favorite discovery vectors.
            </p>
          </div>

          <button
            onClick={() => navigate('/discover')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md transition self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Mood Session</span>
          </button>
        </div>

        {/* Analytics Card: Mood Distribution */}
        {totalEntries > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Your Top Emotional Headspaces</span>
              </h3>
              <span className="text-xs text-slate-400">{totalEntries} recorded sessions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(moodCounts).map(([mood, cnt]) => {
                const count = Number(cnt);
                const percentage = Math.round((count / totalEntries) * 100);
                return (
                  <div
                    key={mood}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{mood}</span>
                      <span className="text-purple-400 font-bold">{percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{count} occurrences</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline Log Entries */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider px-1">
            Session History
          </h3>

          {history.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
              <Smile className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-bold">No mood sessions logged yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Start by running the 6-step discovery wizard.
              </p>
              <Link
                to="/discover"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                <span>Launch Recommender</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => {
                const dateFormatted = new Date(entry.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={entry.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-purple-600/20 text-purple-300 border border-purple-500/30">
                          {entry.mood}
                        </span>
                        <span className="text-xs text-slate-400">
                          in <strong>{entry.situation}</strong> ({entry.state})
                        </span>
                      </div>
                      {entry.topPickTitle && (
                        <p className="text-xs text-slate-300">
                          Matched with:{' '}
                          <strong className="text-white">{entry.topPickTitle}</strong>
                        </p>
                      )}
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateFormatted}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleRerun(entry)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold transition self-start sm:self-center"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-run Match</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
