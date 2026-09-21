import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Dice5,
  Flame,
  Play,
  ArrowRight,
  Tv,
  BookOpen,
  Film,
  Smartphone,
  BookMarked,
  Zap,
  Layers,
  ChevronRight,
  Crown,
  Star,
} from 'lucide-react';
import { ContentItem, ContentType, MoodType } from '../types';
import { ContentCard } from '../components/ContentCard';
import { SurpriseModal } from '../components/SurpriseModal';
import { useLanguage } from '../context/LanguageContext';

const MOODS_LIST: { id: MoodType; emoji: string; label: string; color: string; bg: string }[] = [
  { id: 'Happy', emoji: '😊', label: 'Happy', color: 'text-amber-400', bg: 'hover:border-amber-400/50' },
  { id: 'Motivated', emoji: '💪', label: 'Motivated', color: 'text-orange-400', bg: 'hover:border-orange-400/50' },
  { id: 'Relaxed', emoji: '😴', label: 'Relaxed', color: 'text-emerald-400', bg: 'hover:border-emerald-400/50' },
  { id: 'Sad', emoji: '😢', label: 'Sad', color: 'text-blue-400', bg: 'hover:border-blue-400/50' },
  { id: 'Romantic', emoji: '❤️', label: 'Romantic', color: 'text-pink-400', bg: 'hover:border-pink-400/50' },
  { id: 'Excited', emoji: '🤩', label: 'Excited', color: 'text-yellow-400', bg: 'hover:border-yellow-400/50' },
  { id: 'Curious', emoji: '🧠', label: 'Curious', color: 'text-purple-400', bg: 'hover:border-purple-400/50' },
  { id: 'Stressed', emoji: '😰', label: 'Stressed', color: 'text-cyan-400', bg: 'hover:border-cyan-400/50' },
  { id: 'Emotional', emoji: '🥹', label: 'Emotional', color: 'text-rose-400', bg: 'hover:border-rose-400/50' },
  { id: 'Angry', emoji: '😡', label: 'Angry', color: 'text-red-400', bg: 'hover:border-red-400/50' },
  { id: 'Bored', emoji: '😂', label: 'Bored', color: 'text-teal-400', bg: 'hover:border-teal-400/50' },
  { id: 'Scared', emoji: '😱', label: 'Scared', color: 'text-indigo-400', bg: 'hover:border-indigo-400/50' },
];

const FORMATS: { id: ContentType | 'all'; label: string; icon: any; flag: string; desc: string }[] = [
  { id: 'all', label: 'All Formats', icon: Layers, flag: '✨', desc: 'Unified Universe' },
  { id: 'anime', label: 'Anime', icon: Tv, flag: '🇯🇵', desc: 'Japanese Animation' },
  { id: 'manga', label: 'Manga', icon: BookOpen, flag: '🇯🇵', desc: 'Japanese Comics' },
  { id: 'donghua', label: 'Donghua', icon: Film, flag: '🇨🇳', desc: 'Chinese Animation' },
  { id: 'manhwa', label: 'Manhwa', icon: Smartphone, flag: '🇰🇷', desc: 'Korean Webtoons' },
  { id: 'manhua', label: 'Manhua', icon: BookMarked, flag: '🇨🇳', desc: 'Chinese Comics' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showSurprise, setShowSurprise] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ContentType | 'all'>('all');
  const [trendingItems, setTrendingItems] = useState<ContentItem[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [famousItems, setFamousItems] = useState<ContentItem[]>([]);
  const [loadingFamous, setLoadingFamous] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true);
      try {
        const url = selectedFormat === 'all' ? '/api/trending' : `/api/trending?type=${selectedFormat}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setTrendingItems(data.data);
        }
      } catch (err) {
        console.error('Failed to load trending:', err);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, [selectedFormat]);

  useEffect(() => {
    const fetchFamous = async () => {
      setLoadingFamous(true);
      try {
        const res = await fetch('/api/famous');
        if (res.ok) {
          const data = await res.json();
          setFamousItems(data.data);
        }
      } catch (err) {
        console.error('Failed to load famous items:', err);
      } finally {
        setLoadingFamous(false);
      }
    };
    fetchFamous();
  }, []);

  const handleQuickMoodClick = (mood: MoodType) => {
    navigate(`/discover?presetMood=${encodeURIComponent(mood)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-900">
        {/* Background Gradients & Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-32 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-inner animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Mood + Situation + Energy AI Recommender</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            What are you <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              feeling today?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t(
              'hero_subtitle',
              'Discover your next Anime, Manga, Donghua, Manhwa or Manhua based on your mood, situation, and energy.'
            )}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/discover')}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-purple-900/50 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>{t('find_recommendation', '✨ Find My Recommendation')}</span>
            </button>

            <button
              onClick={() => setShowSurprise(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-purple-500/30 hover:border-purple-400 font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-105"
            >
              <Dice5 className="w-5 h-5 text-pink-400" />
              <span>{t('surprise_me', '🎲 Surprise Me')}</span>
            </button>

            <button
              onClick={() => navigate('/trending')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-sm sm:text-base transition"
            >
              <Flame className="w-5 h-5 text-amber-400" />
              <span>{t('explore_trending', '🔥 Explore Trending')}</span>
            </button>
          </div>

          {/* Quick Mood Chips Strip */}
          <div className="mt-14 pt-8 border-t border-slate-900">
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-4 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Quick Mood Tap</span>
              </span>
              <span className="text-[11px] text-slate-500">Click any mood to launch instant AI match</span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 max-w-5xl mx-auto no-scrollbar scroll-smooth px-2">
              {MOODS_LIST.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleQuickMoodClick(m.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${m.bg}`}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className={m.color}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 5 MEDIA FORMATS EXPLORER */}
      <section className="py-14 border-b border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                <span>Multi-Format Entertainment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Explore Across All 5 Worlds
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                AniMood AI breaks language and format silos. Switch seamlessly between Japanese anime & manga, Korean manhwa webtoons, and Chinese donghua & manhua.
              </p>
            </div>

            {/* Format filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {FORMATS.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{fmt.flag}</span>
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {loadingTrending ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {trendingItems.slice(0, 10).map((item, index) => (
                <ContentCard key={item.contentId} item={item} showRank={index + 1} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to={selectedFormat === 'all' ? '/trending' : `/${selectedFormat}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-purple-300 font-bold text-xs border border-slate-800 hover:border-purple-500/40 transition"
            >
              <span>View More in {selectedFormat.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2B. HALL OF FAME: FAMOUS & TOP RATED */}
      <section className="py-14 border-b border-slate-900 bg-gradient-to-b from-amber-950/15 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Global Hall of Fame</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>Famous & Top-Rated Masterpieces</span>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  9.0+ Rated
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                The most critically acclaimed, globally celebrated titles of all time across Japanese, Korean, and Chinese entertainment.
              </p>
            </div>

            <Link
              to="/trending"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition self-start md:self-auto"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Explore All Hall of Fame</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingFamous ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {famousItems.slice(0, 10).map((item, index) => (
                <ContentCard key={item.contentId} item={item} showRank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. CROSS-MEDIA SPOTLIGHT SECTION */}
      <section className="py-14 border-b border-slate-900 bg-gradient-to-b from-purple-950/20 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase tracking-wider mb-3">
                  Cross-Media Adaptation Engine
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  Loved the Anime? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Dive into the Manhwa & Manga!
                  </span>
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Did you watch <em>Solo Leveling</em> or <em>Link Click</em> and want to read where the storyline goes? AniMood AI links stories across anime, original manhwa, web novels, and donghua with one-click transitions.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => navigate('/manhwa/sl_manhwa_01')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/50 transition"
                  >
                    <span>Inspect Solo Leveling Webtoon</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/donghua/lc_donghua_01')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                  >
                    <span>Inspect Link Click Donghua</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cross media card visual preview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 text-center">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border border-purple-500/40 shadow-lg">
                    <img
                      src="https://cdn.myanimelist.net/images/anime/1586/143534.jpg"
                      alt="Solo Leveling Anime"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-purple-300 block">🇯🇵 Anime</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border border-pink-500/40 shadow-lg">
                    <img
                      src="https://cdn.myanimelist.net/images/manga/3/222295.jpg"
                      alt="Solo Leveling Manhwa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-pink-300 block">🇰🇷 Webtoon / Manhwa</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg">
                    <img
                      src="https://cdn.myanimelist.net/images/anime/1416/114997.jpg"
                      alt="Link Click Donghua"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-300 block">🇨🇳 Donghua</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS / 7-FACTOR ALGORITHM */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Intelligent Scoring Model
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              How the AniMood AI Engine Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Unlike generic recommendation filters, AniMood AI uses a 7-factor weighted scoring algorithm trained on entertainment resonance:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                25%
              </div>
              <h4 className="font-bold text-white text-sm">Mood Resonance</h4>
              <p className="text-xs text-slate-400">
                Matches emotional state with tone, humor, comfort, or psychological intensity.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                20%
              </div>
              <h4 className="font-bold text-white text-sm">Genre Affinity</h4>
              <p className="text-xs text-slate-400">
                Weighted multi-genre vectors balancing requested subgenres and story archetypes.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                15%
              </div>
              <h4 className="font-bold text-white text-sm">Situation Setting</h4>
              <p className="text-xs text-slate-400">
                Adjusts pacing whether you are studying, winding down before sleep, or on a weekend binge.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                10%
              </div>
              <h4 className="font-bold text-white text-sm">Energy State</h4>
              <p className="text-xs text-slate-400">
                Balances fast-paced fight choreography for high energy versus cozy slice-of-life for low energy.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/discover')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-900/40 hover:opacity-95 transition"
            >
              <span>Try the 6-Step Recommender Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Surprise Modal */}
      <SurpriseModal isOpen={showSurprise} onClose={() => setShowSurprise(false)} />
    </div>
  );
};
