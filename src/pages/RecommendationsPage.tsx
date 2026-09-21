import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Share2,
  RefreshCw,
  Flame,
  Star,
  Play,
  BarChart2,
  Tv,
  BookOpen,
  Film,
  Smartphone,
  BookMarked,
  Gem,
  TrendingUp,
  Bookmark,
  Heart,
} from 'lucide-react';
import { RecommendationResponse, RecommendationScoreResult } from '../types';
import { ContentCard } from '../components/ContentCard';
import { TrailerModal } from '../components/TrailerModal';
import { ScoreBreakdownModal } from '../components/ScoreBreakdownModal';
import { useLists } from '../context/ListContext';
import { useLanguage } from '../context/LanguageContext';

export const RecommendationsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useLists();

  const [data, setData] = useState<RecommendationResponse | null>(() => {
    if (location.state?.recommendationData) {
      return location.state.recommendationData;
    }
    const saved = sessionStorage.getItem('animood_last_recommendation');
    return saved ? JSON.parse(saved) : null;
  });

  const [showTrailer, setShowTrailer] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!data) {
      navigate('/discover');
    }
  }, [data, navigate]);

  if (!data) {
    return null;
  }

  const { request, results } = data;
  const bestMatch = results.bestMatch;
  const bestContent = bestMatch.content;
  const favorited = isFavorite(bestContent.contentId);

  const handleShare = () => {
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({
        title: `AniMood AI Recommendation: ${bestContent.title}`,
        text: `I got ${bestContent.title} (${bestMatch.finalScore}% Mood Match) on AniMood AI!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(
        `I matched with "${bestContent.title}" (${bestMatch.finalScore}% Mood Match) on AniMood AI! Try it at: ${url}`
      );
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/discover')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
              title="Change Mood Query"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>Your Recommendations</span>
                <Sparkles className="w-5 h-5 text-pink-400" />
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Tuned for <strong>{request.mood}</strong> • <strong>{request.situation}</strong> •{' '}
                <strong>{request.state}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? 'Copied Link!' : 'Share Results'}</span>
            </button>
            <button
              onClick={() => navigate('/discover')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refine Mood</span>
            </button>
          </div>
        </div>

        {/* 1. BEST MATCH HERO CARD */}
        <section className="relative rounded-3xl overflow-hidden border border-purple-500/40 bg-slate-900/90 shadow-2xl shadow-purple-950/40">
          {/* Ambient Banner Backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-xl scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${bestContent.banner || bestContent.image})` }}
          />

          <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Poster & Badges */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative aspect-[3/4] w-64 sm:w-72 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/50">
                <img
                  src={bestContent.image}
                  alt={bestContent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                  🎯 Top Pick
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-slate-800">
                  ⭐ {bestContent.rating}
                </div>
              </div>
            </div>

            {/* Info and AI Explanation */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    {bestContent.contentType} • {bestContent.country}
                  </span>
                  <span className="text-xs text-slate-400">
                    {bestContent.releaseYear} • {bestContent.status}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {bestContent.title}
                </h2>
                {bestContent.alternativeTitles.english && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Also known as: {bestContent.alternativeTitles.english}
                  </p>
                )}

                {/* Mood Match Score Pill */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm shadow-md">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>{bestMatch.finalScore}% Mood Match</span>
                  </div>

                  <button
                    onClick={() => setShowScoreModal(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>View 7-Factor Breakdown</span>
                  </button>
                </div>
              </div>

              {/* Gemini AI Personalized Explanation */}
              {bestMatch.explanation && (
                <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-700/50 text-xs sm:text-sm text-purple-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-purple-300 font-bold block mb-1">
                      Why this fits your {request.mood} mood:
                    </strong>
                    <p className="leading-relaxed italic">{bestMatch.explanation}</p>
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4">
                {bestContent.description}
              </p>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bestContent.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                {bestContent.trailer?.available && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Official Trailer</span>
                  </button>
                )}

                <button
                  onClick={() => toggleFavorite(bestContent.contentId)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition ${
                    favorited
                      ? 'bg-pink-600 text-white border-pink-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                  <span>{favorited ? 'Favorited' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={() => navigate(`/${bestContent.contentType}/${bestContent.contentId}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                >
                  <span>Full Title Overview</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ANIME FOR YOU */}
        {results.anime && results.anime.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-black text-white">{t('anime_for_you', '🎬 Anime For You')}</h3>
              </div>
              <span className="text-xs text-slate-400">Japanese Animation</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {results.anime.map((r) => (
                <ContentCard key={r.content.contentId} item={r.content} scoreResult={r} />
              ))}
            </div>
          </section>
        )}

        {/* 3. MANGA FOR YOU */}
        {results.manga && results.manga.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-black text-white">{t('manga_for_you', '📖 Manga For You')}</h3>
              </div>
              <span className="text-xs text-slate-400">Japanese Comics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {results.manga.map((r) => (
                <ContentCard key={r.content.contentId} item={r.content} scoreResult={r} />
              ))}
            </div>
          </section>
        )}

        {/* 4. DONGHUA FOR YOU */}
        {results.donghua && results.donghua.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-black text-white">{t('donghua_for_you', '🎞️ Donghua For You')}</h3>
              </div>
              <span className="text-xs text-slate-400">Chinese Animation</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {results.donghua.map((r) => (
                <ContentCard key={r.content.contentId} item={r.content} scoreResult={r} />
              ))}
            </div>
          </section>
        )}

        {/* 5. MANHWA FOR YOU */}
        {results.manhwa && results.manhwa.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-pink-400" />
                <h3 className="text-xl font-black text-white">{t('manhwa_for_you', '📱 Manhwa For You')}</h3>
              </div>
              <span className="text-xs text-slate-400">Korean Webtoons</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {results.manhwa.map((r) => (
                <ContentCard key={r.content.contentId} item={r.content} scoreResult={r} />
              ))}
            </div>
          </section>
        )}

        {/* 6. MANHUA FOR YOU */}
        {results.manhua && results.manhua.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-black text-white">{t('manhua_for_you', '📕 Manhua For You')}</h3>
              </div>
              <span className="text-xs text-slate-400">Chinese Comics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {results.manhua.map((r) => (
                <ContentCard key={r.content.contentId} item={r.content} scoreResult={r} />
              ))}
            </div>
          </section>
        )}

        {/* 7. HIDDEN GEMS */}
        {results.hiddenGems && results.hiddenGems.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-black text-white">{t('hidden_gems', '💎 Hidden Gems')}</h3>
              </div>
              <span className="text-xs text-slate-400">Underrated High-Scoring Picks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {results.hiddenGems.map((r) => (
                <ContentCard key={r.content.contentId} item={r.content} scoreResult={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Embedded Modals */}
      {bestContent.trailer?.available && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          title={bestContent.title}
          youtubeId={bestContent.trailer?.youtubeId}
          embedUrl={bestContent.trailer?.embedUrl}
        />
      )}

      <ScoreBreakdownModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        result={bestMatch}
      />
    </div>
  );
};
