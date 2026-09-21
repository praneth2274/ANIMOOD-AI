import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Layers, SlidersHorizontal, X } from 'lucide-react';
import { ContentItem, ContentType } from '../types';
import { ContentCard } from '../components/ContentCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(queryParam);
  const [selectedType, setSelectedType] = useState<string>(typeParam);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    setVisibleCount(30);
  }, [query, selectedType, selectedGenre, selectedStatus]);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (selectedType !== 'all') params.set('type', selectedType);
        if (selectedGenre !== 'all') params.set('genre', selectedGenre);
        if (selectedStatus !== 'all') params.set('status', selectedStatus);

        const res = await fetch(`/api/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.items);
        }
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      doSearch();
    }, 250);

    return () => clearTimeout(debounce);
  }, [query, selectedType, selectedGenre, selectedStatus]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedGenre('all');
    setSelectedStatus('all');
    setSearchParams({});
  };

  const types = [
    { id: 'all', label: 'All Media' },
    { id: 'anime', label: 'Anime 🇯🇵' },
    { id: 'manga', label: 'Manga 🇯🇵' },
    { id: 'donghua', label: 'Donghua 🇨🇳' },
    { id: 'manhwa', label: 'Manhwa 🇰🇷' },
    { id: 'manhua', label: 'Manhua 🇨🇳' },
  ];

  const genres = [
    'all',
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Header Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-purple-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchParams({ q: e.target.value, type: selectedType });
              }}
              placeholder="Search across Anime, Manga, Donghua, Manhwa, Manhua by title, character, author..."
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Format pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedType === t.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Genre and Status dropdowns */}
            <div className="flex items-center gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Genres</option>
                {genres.filter((g) => g !== 'all').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="Ongoing">Ongoing / Airing</option>
                <option value="Completed">Completed / Finished</option>
              </select>

              {(query || selectedType !== 'all' || selectedGenre !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
                  title="Reset Filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span>
            Showing <strong className="text-white">{Math.min(visibleCount, results.length)}</strong> of{' '}
            <strong className="text-purple-300">{results.length}</strong> matching titles
          </span>
          {query && (
            <span>
              Searching for: "<strong className="text-purple-300">{query}</strong>"
            </span>
          )}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No results found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any titles matching your filters. Try clearing some filters or searching for alternate keywords.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {results.slice(0, visibleCount).map((item) => (
                <ContentCard key={item.contentId} item={item} />
              ))}
            </div>

            {visibleCount < results.length && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 30, results.length))}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition flex items-center gap-2"
                >
                  <span>Load More ({Math.min(30, results.length - visibleCount)} more)</span>
                </button>
                <button
                  onClick={() => setVisibleCount(results.length)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition"
                >
                  <span>View All {results.length} Titles</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
