import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useLists } from '../context/ListContext';
import { WatchlistStatus } from '../types';
import { ContentCard } from '../components/ContentCard';

export const MyListPage: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useLists();
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'Watching', label: 'Watching' },
    { id: 'Reading', label: 'Reading' },
    { id: 'Plan to Watch', label: 'Plan to Watch' },
    { id: 'Plan to Read', label: 'Plan to Read' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Completed Reading', label: 'Completed Reading' },
  ];

  const filteredWatchlist = watchlist.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="w-5 h-5 text-purple-400 fill-current" />
              <h1 className="text-3xl font-black text-white">My Watch & Reading List</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Track your journey across Anime, Manga, Donghua, Manhwa, and Manhua.
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

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Grid */}
        {filteredWatchlist.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Your list is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You have no titles in this category. Click the bookmark icon on any card to add it to your tracking list.
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
            {filteredWatchlist.map((entry) => {
              if (!entry.content) return null;
              return (
                <div key={entry.contentId} className="relative group">
                  <ContentCard item={entry.content} />
                  <button
                    onClick={() => removeFromWatchlist(entry.contentId)}
                    title="Remove from list"
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
