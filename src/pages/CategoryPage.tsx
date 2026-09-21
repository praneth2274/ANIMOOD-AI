import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentItem, ContentType } from '../types';
import { ContentCard } from '../components/ContentCard';
import { Search, Filter, Star, Flame, Sparkles } from 'lucide-react';

interface CategoryConfig {
  type: ContentType;
  title: string;
  flag: string;
  country: string;
  desc: string;
  accent: string;
}

const CATEGORY_CONFIGS: Record<ContentType, CategoryConfig> = {
  anime: {
    type: 'anime',
    title: 'Anime',
    flag: '🇯🇵',
    country: 'Japan',
    desc: 'Immerse yourself in legendary Japanese animation, from Shonen epics to poignant slice-of-life.',
    accent: 'from-purple-500 to-indigo-500',
  },
  manga: {
    type: 'manga',
    title: 'Manga',
    flag: '🇯🇵',
    country: 'Japan',
    desc: 'Read the original masterpiece Japanese manga series with captivating art and intricate panels.',
    accent: 'from-indigo-500 to-blue-500',
  },
  donghua: {
    type: 'donghua',
    title: 'Donghua',
    flag: '🇨🇳',
    country: 'China',
    desc: 'Experience groundbreaking Chinese animation, breathtaking 3D/2D cultivation sagas and mysteries.',
    accent: 'from-cyan-500 to-teal-500',
  },
  manhwa: {
    type: 'manhwa',
    title: 'Manhwa',
    flag: '🇰🇷',
    country: 'South Korea',
    desc: 'Scroll through full-color Korean webtoons featuring hunter dungeons, royalty romance, and martial arts.',
    accent: 'from-pink-500 to-rose-500',
  },
  manhua: {
    type: 'manhua',
    title: 'Manhua',
    flag: '🇨🇳',
    country: 'China',
    desc: 'Explore Chinese comics steeped in ancient martial arts, rebirth cultivation, and fantasy realms.',
    accent: 'from-amber-500 to-orange-500',
  },
};

const GENRES = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
  'Cultivation',
];

export const CategoryPage: React.FC<{ forcedType?: ContentType }> = ({ forcedType }) => {
  const params = useParams<{ category?: string }>();
  const categoryKey = (forcedType || params.category || 'anime') as ContentType;
  const config = CATEGORY_CONFIGS[categoryKey] || CATEGORY_CONFIGS.anime;

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'releaseYear'>('popularity');
  const [filterTab, setFilterTab] = useState<'all' | 'trending' | 'top'>('all');
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    setVisibleCount(30);
  }, [config.type, filterTab, searchQuery, selectedGenre, sortBy]);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      setLoading(true);
      try {
        let endpoint = `/api/${config.type}/trending`;
        if (filterTab === 'top') {
          endpoint = `/api/${config.type}/top`;
        }
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setItems(data.data);
        }
      } catch (err) {
        console.error('Failed to load category items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryItems();
  }, [config.type, filterTab]);

  // Filtering & Sorting
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === 'All' ||
        item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'releaseYear') return b.releaseYear - a.releaseYear;
      return b.popularity - a.popularity;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{config.flag}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  {config.country} Media Ecosystem
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white">{config.title}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {config.desc}
              </p>
            </div>

            <Link
              to={`/discover?presetMood=Motivated`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-900/40 hover:opacity-95 transition self-start md:self-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Mood Matches</span>
            </Link>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Tab switchers: All / Trending / Top Rated */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterTab === 'all'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setFilterTab('trending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  filterTab === 'trending'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Trending</span>
              </button>
              <button
                onClick={() => setFilterTab('top')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  filterTab === 'top'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Top Rated</span>
              </button>
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={`Search ${config.title}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating (Highest)</option>
                <option value="releaseYear">Year (Newest)</option>
              </select>
            </div>
          </div>

          {/* Genre Scrollable Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedGenre === g
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{Math.min(visibleCount, filteredItems.length)}</strong> of{' '}
            <strong className="text-purple-300">{filteredItems.length}</strong> {config.title} titles
          </span>
          {visibleCount < filteredItems.length && (
            <button
              onClick={() => setVisibleCount(filteredItems.length)}
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              Show all ({filteredItems.length})
            </button>
          )}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-base font-bold text-slate-300">No {config.title} found</p>
            <p className="text-xs mt-1">Try relaxing the search query or genre filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {filteredItems.slice(0, visibleCount).map((item) => (
                <ContentCard key={item.contentId} item={item} />
              ))}
            </div>

            {visibleCount < filteredItems.length && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 30, filteredItems.length))}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition flex items-center gap-2"
                >
                  <span>Load More ({Math.min(30, filteredItems.length - visibleCount)} more)</span>
                </button>
                <button
                  onClick={() => setVisibleCount(filteredItems.length)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition"
                >
                  <span>View All {filteredItems.length} Titles</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
