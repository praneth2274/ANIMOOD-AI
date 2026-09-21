import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Star,
  Heart,
  Bookmark,
  Share2,
  Play,
  ArrowLeft,
  Calendar,
  Layers,
  Clock,
  ExternalLink,
  Users,
  Compass,
  Check,
} from 'lucide-react';
import { ContentItem, ContentType, WatchlistStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLists } from '../context/ListContext';
import { TrailerModal } from '../components/TrailerModal';
import { ContentCard } from '../components/ContentCard';

export const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isFavorite, toggleFavorite, setWatchlistStatus, getWatchlistEntry } = useLists();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [crossMedia, setCrossMedia] = useState<Record<ContentType, ContentItem | null> | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showWatchlistMenu, setShowWatchlistMenu] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [contentRes, crossRes] = await Promise.all([
          fetch(`/api/content/${id}`),
          fetch(`/api/content/${id}/cross-media`),
        ]);

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setItem(contentData.data);
        }

        if (crossRes.ok) {
          const crossData = await crossRes.json();
          setCrossMedia(crossData.crossMedia);
        }
      } catch (err) {
        console.error('Failed to load details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Content Not Found</h2>
        <p className="text-sm text-slate-400 mb-4">The requested title could not be located.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const favorited = isFavorite(item.contentId);
  const watchlistEntry = getWatchlistEntry(item.contentId);

  const handleRate = async (score: number) => {
    setUserRating(score);
    if (token) {
      try {
        await fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentId: item.contentId,
            contentType: item.contentType,
            rating: score,
          }),
        });
        setRatingSuccess(true);
        setTimeout(() => setRatingSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to submit rating:', err);
      }
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: item.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  const watchlistOptions: WatchlistStatus[] =
    item.contentType === 'anime' || item.contentType === 'donghua'
      ? ['Watching', 'Completed', 'Plan to Watch']
      : ['Reading', 'Completed Reading', 'Plan to Read'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Banner Backdrop */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden border-b border-slate-900">
        <img
          src={item.banner || item.image}
          alt={item.title}
          className="w-full h-full object-cover filter blur-sm brightness-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 backdrop-blur-md text-xs font-semibold text-slate-200 border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-48 relative z-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Poster & Quick Controls */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <div className="aspect-[3/4] w-64 sm:w-72 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/40 relative group bg-slate-900">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.trailer?.available && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </button>
              )}
            </div>

            {/* Actions: Favorite, Watchlist, Share */}
            <div className="w-64 sm:w-72 mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleFavorite(item.contentId)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition ${
                    favorited
                      ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-900/40'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                  <span>{favorited ? 'Favorited' : 'Favorite'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-semibold transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{shareCopied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Watchlist status selector */}
              <div className="relative">
                <button
                  onClick={() => setShowWatchlistMenu(!showWatchlistMenu)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition ${
                    watchlistEntry
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${watchlistEntry ? 'fill-current' : ''}`} />
                  <span>
                    {watchlistEntry ? `In List: ${watchlistEntry.status}` : 'Add to My Watchlist'}
                  </span>
                </button>

                {showWatchlistMenu && (
                  <div className="absolute top-full mt-2 inset-x-0 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 text-xs text-slate-200">
                    <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select List Status
                    </p>
                    {watchlistOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setWatchlistStatus(item.contentId, item.contentType, status);
                          setShowWatchlistMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-xs font-medium flex items-center justify-between ${
                          watchlistEntry?.status === status
                            ? 'bg-purple-600/30 text-purple-300 font-bold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{status}</span>
                        {watchlistEntry?.status === status && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Community 5-star Rating widget */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-slate-300 mb-1.5">Rate this title</p>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (userRating || 0) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {ratingSuccess && (
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                    Rating saved! Thank you.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Title Info, Synopsis, Specific Metadata */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-purple-600/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  {item.contentType} • {item.country}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating.toFixed(1)} / 10</span>
                </span>
                <span className="text-xs text-slate-400">
                  {item.releaseYear} • {item.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {item.title}
              </h1>

              {/* Native titles */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-2">
                {item.alternativeTitles.english && (
                  <span>English: <strong className="text-slate-200">{item.alternativeTitles.english}</strong></span>
                )}
                {item.alternativeTitles.japanese && (
                  <span>Japanese: <strong className="text-slate-200">{item.alternativeTitles.japanese}</strong></span>
                )}
                {item.alternativeTitles.chinese && (
                  <span>Chinese: <strong className="text-slate-200">{item.alternativeTitles.chinese}</strong></span>
                )}
                {item.alternativeTitles.korean && (
                  <span>Korean: <strong className="text-slate-200">{item.alternativeTitles.korean}</strong></span>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Synopsis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                {item.description}
              </p>
            </div>

            {/* Specific Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
              {item.studio && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Studio</span>
                  <span className="font-bold text-slate-200">{item.studio}</span>
                </div>
              )}
              {item.author && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Author / Story</span>
                  <span className="font-bold text-slate-200">{item.author}</span>
                </div>
              )}
              {item.artist && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Artist / Art</span>
                  <span className="font-bold text-slate-200">{item.artist}</span>
                </div>
              )}
              {item.episodes && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Episodes</span>
                  <span className="font-bold text-slate-200">{item.episodes}</span>
                </div>
              )}
              {item.chapters && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Chapters</span>
                  <span className="font-bold text-slate-200">{item.chapters}</span>
                </div>
              )}
              {item.duration && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Duration</span>
                  <span className="font-bold text-slate-200">{item.duration}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block text-[11px]">Original Language</span>
                <span className="font-bold text-slate-200">{item.language}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Popularity Rank</span>
                <span className="font-bold text-purple-400">Top {item.popularity}%</span>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-purple-500/40 transition"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Characters section */}
            {item.characters && item.characters.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-900">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Main Characters</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {item.characters.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{c.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CROSS-MEDIA SECTION (Section 19: "If you liked this...") */}
        {crossMedia && (
          <section className="mt-16 pt-10 border-t border-slate-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Cross-Media Adaptations & Connections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                If you liked <span className="text-purple-400">{item.title}</span>...
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore connected universes across Anime, Manga, Donghua, Manhwa, and Manhua!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.entries(crossMedia).map(([category, rel]) => {
                const related = rel as ContentItem | null;
                if (!related) return null;
                return (
                  <div key={related.contentId} className="space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-300 block uppercase tracking-wider">
                      Related in {category}
                    </span>
                    <ContentCard item={related} />
                  </div>
                );
              })}
            </div>
          </section>
        )}
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
    </div>
  );
};
