import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ContentType } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_GENRES = [
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

const CONTENT_TYPES: { id: ContentType; label: string; flag: string; desc: string }[] = [
  { id: 'anime', label: 'Anime', flag: '🇯🇵', desc: 'Japanese Animation' },
  { id: 'manga', label: 'Manga', flag: '🇯🇵', desc: 'Japanese Comics' },
  { id: 'donghua', label: 'Donghua', flag: '🇨🇳', desc: 'Chinese Animation' },
  { id: 'manhwa', label: 'Manhwa', flag: '🇰🇷', desc: 'Korean Webtoons' },
  { id: 'manhua', label: 'Manhua', flag: '🇨🇳', desc: 'Chinese Comics' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    user?.favoriteGenres || ['Action', 'Fantasy', 'Adventure']
  );
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>(
    user?.favoriteContentTypes || ['anime', 'manga', 'manhwa', 'donghua', 'manhua']
  );
  const [prefLang, setPrefLang] = useState<string>(user?.preferredLanguage || currentLanguage);
  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleType = (type: ContentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? (prev.length > 1 ? prev.filter((t) => t !== type) : prev) : [...prev, type]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    setLanguage(prefLang);
    if (user) {
      await updateProfile({
        favoriteGenres: selectedGenres,
        favoriteContentTypes: selectedTypes,
        preferredLanguage: prefLang,
        onboardingCompleted: true,
      });
    } else {
      localStorage.setItem('animood_onboarding_done', 'true');
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 mb-3 shadow-lg shadow-purple-900/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-wide">
            Welcome to AniMood AI
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Step {step} of 3 • Personalize your AI entertainment radar
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s ? 'w-8 bg-purple-500' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Content Formats */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                What content formats do you enjoy?
              </h4>
              <p className="text-xs text-slate-400">
                AniMood seamlessly recommends across all five media ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CONTENT_TYPES.map((t) => {
                const selected = selectedTypes.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleType(t.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      selected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-950/40'
                        : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{t.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-white">{t.label}</h5>
                        {selected && <Check className="w-4 h-4 text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition hover:opacity-95"
            >
              <span>Continue to Genres</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Favorite Genres */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Choose your favorite genres
              </h4>
              <p className="text-xs text-slate-400">
                Select 3 or more genres you enjoy exploring.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
              {AVAILABLE_GENRES.map((genre) => {
                const selected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {genre} {selected && '✓'}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition hover:opacity-95"
              >
                <span>Continue to Language</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferred Language & Finalize */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Select your preferred interface language
              </h4>
              <p className="text-xs text-slate-400">
                AniMood AI is fully multilingual with 11 localized dialects.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setPrefLang(l.code)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    prefLang === l.code
                      ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{l.flag}</span>
                  <div className="min-w-0">
                    <p className="text-xs truncate">{l.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{l.nativeName}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition hover:opacity-95"
              >
                {saving ? 'Saving...' : 'Start Exploring AniMood ✨'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
