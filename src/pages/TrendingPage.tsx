import React, { useState, useEffect } from 'react';
import { Flame, Star, Gem, Sparkles, Crown } from 'lucide-react';
import { ContentItem, ContentType } from '../types';
import { ContentCard } from '../components/ContentCard';

export const TrendingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'topRated' | 'famous' | 'hiddenGems'>('trending');
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(40);

  useEffect(() => {
    setVisibleCount(40);
  }, [activeTab, activeType]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/trending';
        if (activeTab === 'topRated') endpoint = '/api/top-rated';
        if (activeTab === 'famous') endpoint = '/api/famous';
        if (activeTab === 'hiddenGems') endpoint = '/api/hidden-gems';

        if (activeType !== 'all') {
          endpoint += `?type=${activeType}`;
        }

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setItems(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch trending:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeTab, activeType]);

  const formats: { id: ContentType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Media' },
    { id: 'anime', label: 'Anime 🇯🇵' },
    { id: 'manga', label: 'Manga 🇯🇵' },
    { id: 'donghua', label: 'Donghua 🇨🇳' },
    { id: 'manhwa', label: 'Manhwa 🇰🇷' },
    { id: 'manhua', label: 'Manhua 🇨🇳' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Live Community Engagement
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">Popular & Trending Universes</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track the most engaged Anime, Manga, Donghua, Manhwa, and Manhua globally.
            </p>
          </div>

          {/* Section Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-center">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'trending'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setActiveTab('topRated')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'topRated'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Top Rated</span>
            </button>
            <button
              onClick={() => setActiveTab('famous')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'famous'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Famous Masterpieces</span>
            </button>
            <button
              onClick={() => setActiveTab('hiddenGems')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'hiddenGems'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              <span>Hidden Gems</span>
            </button>
          </div>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveType(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeType === f.id
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{Math.min(visibleCount, items.length)}</strong> of{' '}
            <strong className="text-purple-300">{items.length}</strong> featured titles
          </span>
          {visibleCount < items.length && (
            <button
              onClick={() => setVisibleCount(items.length)}
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              Show all ({items.length})
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {items.slice(0, visibleCount).map((item, index) => (
                <ContentCard key={item.contentId} item={item} showRank={index + 1} />
              ))}
            </div>

            {visibleCount < items.length && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 40, items.length))}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition flex items-center gap-2"
                >
                  <span>Load More ({Math.min(40, items.length - visibleCount)} more)</span>
                </button>
                <button
                  onClick={() => setVisibleCount(items.length)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition"
                >
                  <span>View All {items.length} Titles</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
