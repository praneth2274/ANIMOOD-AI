import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Play, Star, Sparkles, BarChart2 } from 'lucide-react';
import { ContentItem, RecommendationScoreResult, WatchlistStatus } from '../types';
import { useLists } from '../context/ListContext';
import { TrailerModal } from './TrailerModal';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';

interface ContentCardProps {
  item: ContentItem;
  scoreResult?: RecommendationScoreResult;
  showRank?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, scoreResult, showRank }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, setWatchlistStatus, getWatchlistEntry } = useLists();

  const [showTrailer, setShowTrailer] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showWatchlistMenu, setShowWatchlistMenu] = useState(false);

  const favorited = isFavorite(item.contentId);
  const watchlistEntry = getWatchlistEntry(item.contentId);

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering when user clicks action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.no-card-click')) {
      return;
    }
    navigate(`/${item.contentType}/${item.contentId}`);
  };

  const countryFlags = {
    Japan: '🇯🇵',
    'South Korea': '🇰🇷',
    China: '🇨🇳',
  };

  const watchlistOptions: WatchlistStatus[] =
    item.contentType === 'anime' || item.contentType === 'donghua'
      ? ['Watching', 'Completed', 'Plan to Watch']
      : ['Reading', 'Completed Reading', 'Plan to Read'];

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col bg-slate-900/80 dark:bg-slate-900/80 light:bg-white rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 hover:-translate-y-1 cursor-pointer"
      >
        {/* Poster Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-800">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Top Bar Badges */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
            {/* Country & Type */}
            <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-200">
              <span>{countryFlags[item.country] || '🌐'}</span>
              <span className="uppercase tracking-wider text-[10px] text-purple-300 font-bold">
                {item.contentType}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800 text-xs font-bold text-amber-400">
              <Star className="w-3 h-3 fill-current text-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Optional Rank Badge (for Top/Trending) */}
          {showRank !== undefined && (
            <div className="absolute top-10 left-2.5 w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-lg pointer-events-none">
              #{showRank}
            </div>
          )}

          {/* Mood Match Badge (if scoreResult provided) */}
          {scoreResult && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowScoreModal(true);
              }}
              title="Click to view 7-Factor algorithm breakdown"
              className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-pink-900/50 border border-pink-400/40 cursor-pointer transition transform hover:scale-105"
            >
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{scoreResult.finalScore}% Match</span>
              <BarChart2 className="w-3 h-3 ml-0.5 opacity-80" />
            </div>
          )}

          {/* Quick Actions (Floating on poster) */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
            {/* Trailer button */}
            {item.trailer?.available && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTrailer(true);
                }}
                title="Watch Official Trailer"
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-red-600 text-slate-300 hover:text-white backdrop-blur-md border border-slate-800 hover:border-red-500 transition shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Favorite button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.contentId);
              }}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-xl backdrop-blur-md border transition shadow-md ${
                favorited
                  ? 'bg-pink-600 text-white border-pink-500'
                  : 'bg-slate-950/80 text-slate-300 hover:text-pink-400 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
            </button>

            {/* Watchlist button with popover */}
            <div className="relative no-card-click">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWatchlistMenu((prev) => !prev);
                }}
                title="Watchlist status"
                className={`p-2 rounded-xl backdrop-blur-md border transition shadow-md ${
                  watchlistEntry
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-950/80 text-slate-300 hover:text-purple-400 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${watchlistEntry ? 'fill-current' : ''}`} />
              </button>

              {showWatchlistMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-full mb-2 w-44 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 text-xs text-slate-200"
                >
                  <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Add to List
                  </p>
                  {watchlistOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setWatchlistStatus(item.contentId, item.contentType, status);
                        setShowWatchlistMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition text-xs font-medium flex items-center justify-between ${
                        watchlistEntry?.status === status
                          ? 'bg-purple-600/30 text-purple-300 font-bold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{status}</span>
                      {watchlistEntry?.status === status && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
          <div>
            <h4
              className="font-bold text-sm text-slate-100 dark:text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1"
              title={item.title}
            >
              {item.title}
            </h4>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <span>{item.releaseYear}</span>
              <span>•</span>
              <span className="capitalize">{item.status}</span>
              {item.episodes && (
                <>
                  <span>•</span>
                  <span>{item.episodes} eps</span>
                </>
              )}
              {item.chapters && (
                <>
                  <span>•</span>
                  <span>{item.chapters} chs</span>
                </>
              )}
            </div>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1">
            {item.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-400 border border-slate-700/50"
              >
                {genre}
              </span>
            ))}
            {item.genres.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-500">
                +{item.genres.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Trailer Modal */}
      {item.trailer?.available && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          title={item.title}
          youtubeId={item.trailer?.youtubeId}
          embedUrl={item.trailer?.embedUrl}
        />
      )}

      {/* Detailed 7-Factor Score Breakdown */}
      {scoreResult && (
        <ScoreBreakdownModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          result={scoreResult}
        />
      )}
    </>
  );
};
