import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Clock,
  Compass,
  Tv,
  Globe,
  Loader2,
} from 'lucide-react';
import {
  MoodType,
  SituationType,
  EnergyStateType,
  ContentType,
  RecommendationResponse,
} from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MOODS: { id: MoodType; emoji: string; label: string; desc: string }[] = [
  { id: 'Happy', emoji: '😊', label: 'Happy', desc: 'Uplifting, wholesome, comedic' },
  { id: 'Motivated', emoji: '💪', label: 'Motivated', desc: 'Inspirational, triumph, sports' },
  { id: 'Relaxed', emoji: '😴', label: 'Relaxed', desc: 'Calming, slice-of-life, cozy' },
  { id: 'Sad', emoji: '😢', label: 'Sad', desc: 'Cathartic, tear-jerking, heartfelt' },
  { id: 'Romantic', emoji: '❤️', label: 'Romantic', desc: 'Sweet, passionate, chemistry' },
  { id: 'Excited', emoji: '🤩', label: 'Excited', desc: 'High-octane, hype, battles' },
  { id: 'Curious', emoji: '🧠', label: 'Curious', desc: 'Mind games, mystery, plot twists' },
  { id: 'Stressed', emoji: '😰', label: 'Stressed', desc: 'Stress relief, chill humor' },
  { id: 'Emotional', emoji: '🥹', label: 'Emotional', desc: 'Deep connections, drama' },
  { id: 'Angry', emoji: '😡', label: 'Angry', desc: 'Revenge, intense action, justice' },
  { id: 'Bored', emoji: '😂', label: 'Bored', desc: 'Unpredictable, thrilling, fun' },
  { id: 'Scared', emoji: '😱', label: 'Scared', desc: 'Spine-chilling, horror, thrills' },
];

const SITUATIONS: { id: SituationType; emoji: string; label: string; desc: string }[] = [
  { id: 'After College', emoji: '🎓', label: 'After College / Work', desc: 'Unwind after classes or shifts' },
  { id: 'Studying', emoji: '📚', label: 'Studying / Break', desc: 'Short, refreshing, light' },
  { id: 'Before Sleep', emoji: '🌙', label: 'Before Sleep', desc: 'Gentle, soothing bedside story' },
  { id: 'Travelling', emoji: '🚆', label: 'Travelling / Commute', desc: 'Quick chapters or offline watch' },
  { id: 'At Home', emoji: '🏠', label: 'At Home', desc: 'Comfortable binge watching/reading' },
  { id: 'Weekend', emoji: '☀️', label: 'Weekend Binge', desc: 'Epic arcs, deep immersion' },
  { id: 'Stressful Day', emoji: '😩', label: 'Stressful Day', desc: 'Instant mood reset' },
  { id: 'Emotional Day', emoji: '🥹', label: 'Emotional Day', desc: 'Resonating stories' },
  { id: 'Party Mood', emoji: '🎉', label: 'Party / Friends', desc: 'Fun to watch with groups' },
  { id: 'Free Time', emoji: '🛋️', label: 'Free Time', desc: 'Open to anything captivating' },
];

const STATES: { id: EnergyStateType; emoji: string; label: string; desc: string }[] = [
  { id: 'Low Energy', emoji: '🔋', label: 'Low Energy', desc: 'Low effort, easy to follow, chill' },
  { id: 'Medium Energy', emoji: '⚡', label: 'Medium Energy', desc: 'Balanced pacing and plot' },
  { id: 'High Energy', emoji: '🔥', label: 'High Energy', desc: 'Fast-paced, action, explosions' },
  { id: 'Emotional', emoji: '🥹', label: 'Emotional', desc: 'Open to deep feelings and tears' },
  { id: 'Focused', emoji: '🎯', label: 'Focused', desc: 'Complex mysteries, detailed lore' },
  { id: 'Curious', emoji: '🧠', label: 'Curious', desc: 'Ready for mind-bending sci-fi' },
  { id: 'Relaxed', emoji: '🧘', label: 'Relaxed', desc: 'Slow burner, peaceful vibes' },
];

const GENRES = [
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
  'Historical',
  'Cultivation',
  'Martial Arts',
  'Isekai',
];

const CONTENT_TYPES: { id: ContentType | 'All'; label: string; flag: string; desc: string }[] = [
  { id: 'All', label: 'All Formats', flag: '✨', desc: 'Recommend across all 5 mediums' },
  { id: 'anime', label: 'Anime', flag: '🇯🇵', desc: 'Japanese Animation' },
  { id: 'manga', label: 'Manga', flag: '🇯🇵', desc: 'Japanese Comics' },
  { id: 'donghua', label: 'Donghua', flag: '🇨🇳', desc: 'Chinese Animation' },
  { id: 'manhwa', label: 'Manhwa', flag: '🇰🇷', desc: 'Korean Webtoons' },
  { id: 'manhua', label: 'Manhua', flag: '🇨🇳', desc: 'Chinese Comics' },
];

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const { currentLanguage, languages, t } = useLanguage();

  const presetMoodParam = searchParams.get('presetMood') as MoodType | null;

  // Wizard States
  const [step, setStep] = useState<number>(1);
  const [mood, setMood] = useState<MoodType>(presetMoodParam || 'Happy');
  const [situation, setSituation] = useState<SituationType>('At Home');
  const [state, setState] = useState<EnergyStateType>('Medium Energy');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    user?.favoriteGenres?.slice(0, 3) || ['Action', 'Fantasy']
  );
  const [contentType, setContentType] = useState<ContentType | 'All'>('All');
  const [language, setLanguage] = useState<string>('English');
  const [langSearch, setLangSearch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (presetMoodParam) {
      setMood(presetMoodParam);
    }
  }, [presetMoodParam]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        mood,
        situation,
        state,
        genres: selectedGenres,
        contentType,
        language,
      };

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data: RecommendationResponse = await res.json();
        // Store in sessionStorage for fast back-navigation and pass via route state
        sessionStorage.setItem('animood_last_recommendation', JSON.stringify(data));
        navigate('/recommendations', { state: { recommendationData: data } });
      } else {
        alert('Failed to generate recommendations. Please try again.');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      alert('Network error while contacting AI engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Wizard Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>6-Step Multi-Vector Matcher</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Personalized Discovery Wizard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Tell AniMood AI your current headspace, setting, and format preferences for an exact match.
          </p>

          {/* Progress Bar & Indicators */}
          <div className="mt-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
              <span>Step {step} of 6</span>
              <span className="text-purple-400">
                {step === 1 && '1. Mood & Tone'}
                {step === 2 && '2. Situation & Pacing'}
                {step === 3 && '3. Energy & Focus'}
                {step === 4 && '4. Genre Preferences'}
                {step === 5 && '5. Content Format'}
                {step === 6 && '6. Language & Finalize'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-400 transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wizard Main Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* STEP 1: MOOD */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white">How are you feeling right now?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select the emotional headspace you want your story to harmonize with.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {MOODS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-950/50 scale-[1.02]'
                          : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-3xl mb-2">{m.emoji}</span>
                      <span className="text-sm font-bold text-white">{m.label}</span>
                      <span className="text-[10px] text-slate-400 mt-1 leading-tight">{m.desc}</span>
                      {isSelected && (
                        <div className="mt-2 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SITUATION */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-extrabold text-white">What situation are you in?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Helps adjust episode/chapter duration, narrative density, and cliffhangers.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {SITUATIONS.map((s) => {
                  const isSelected = situation === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSituation(s.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-950/50 scale-[1.02]'
                          : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl mb-2">{s.emoji}</span>
                      <span className="text-xs font-bold text-white leading-tight">{s.label}</span>
                      <span className="text-[10px] text-slate-400 mt-1 leading-tight">{s.desc}</span>
                      {isSelected && (
                        <div className="mt-2 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: STATE / ENERGY */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-extrabold text-white">What's your current energy state?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Matches action choreography versus introspective dialogue.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {STATES.map((st) => {
                  const isSelected = state === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setState(st.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                          : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl mb-2">{st.emoji}</span>
                      <span className="text-sm font-bold text-white">{st.label}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{st.desc}</span>
                      {isSelected && (
                        <div className="mt-2 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: GENRES */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Select preferred genres</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pick 1 or multiple genres. Leave empty to allow any thrilling genre.
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-400">
                  {selectedGenres.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 max-h-72 overflow-y-auto p-1">
                {GENRES.map((g) => {
                  const isSelected = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                          : 'bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {g} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: CONTENT TYPE */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-extrabold text-white">What format do you want to experience?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a specific media format, or "All Formats" to receive the best cross-media recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CONTENT_TYPES.map((ct) => {
                  const isSelected = contentType === ct.id;
                  return (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() => setContentType(ct.id)}
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-pink-600/20 border-pink-500 text-white shadow-lg shadow-pink-950/40 scale-[1.02]'
                          : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{ct.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white">{ct.label}</h4>
                          {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ct.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: LANGUAGE & CONFIRM */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-extrabold text-white">Choose your preferred language</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  AniMood matches titles available with audio dubs or subtitles in your language ({languages.length} available).
                </p>
              </div>

              {/* Language Search / Filter */}
              <div className="relative">
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Search languages (e.g. Hindi, Japanese, Spanish, Bengali)..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                {languages
                  .filter(
                    (l) =>
                      !langSearch ||
                      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
                      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
                      l.code.toLowerCase().includes(langSearch.toLowerCase())
                  )
                  .map((lang) => {
                  const isSelected = language === lang.name;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.name)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                          : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="min-w-0">
                        <p className="text-xs truncate">{lang.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{lang.nativeName}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Summary Vector Review */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-900/40 space-y-2 text-xs">
                <span className="font-bold text-purple-300 uppercase tracking-wider text-[10px]">
                  Your Request Vector:
                </span>
                <div className="flex flex-wrap gap-2 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Mood: <strong>{mood}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Situation: <strong>{situation}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Energy: <strong>{state}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Format: <strong>{contentType}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Language: <strong>{language}</strong>
                  </span>
                  {selectedGenres.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Genres: <strong>{selectedGenres.join(', ')}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-extrabold shadow-md shadow-purple-900/40 transition"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGenerate}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-sm font-black shadow-xl shadow-purple-900/50 transition hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scoring Anime & Manhwa Universe...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Generate My Recommendations</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
