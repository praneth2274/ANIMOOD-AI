import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useLists } from '../context/ListContext';
import { ContentItem, ContentType } from '../types';
import { ContentCard } from '../components/ContentCard';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useLists();
  const [favoriteItems, setFavoriteItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all');

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/trending');
        if (res.ok) {
          const all = await fetch('/api/search?q=');
          const allData = await all.json();
          const items: ContentItem[] = allData.items || [];
          setFavoriteItems(items.filter((item) => favorites.includes(item.contentId)));
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [favorites]);

  const filteredItems = favoriteItems.filter((item) => {
    if (activeType === 'all') return true;
    return item.contentType === activeType;
  });

  const formats: { id: ContentType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Favorites' },
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              <h1 className="text-3xl font-black text-white">Your Saved Favorites</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {favoriteItems.length} beloved stories across all formats.
            </p>
          </div>

          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover More</span>
          </Link>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveType(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeType === f.id
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No favorites saved yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tap the heart icon on any anime, manga, manhwa, donghua, or manhua card to save your favorites here.
            </p>
            <Link
              to="/discover"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg transition"
            >
              <span>Explore Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <ContentCard key={item.contentId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
