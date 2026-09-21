import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLists } from '../context/ListContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User as UserIcon,
  Shield,
  Heart,
  Bookmark,
  Sparkles,
  Save,
  Check,
  Globe,
  Settings,
} from 'lucide-react';

const AVATARS = [
  'https://cdn.myanimelist.net/images/characters/2/469446.jpg', // Anya
  'https://cdn.myanimelist.net/images/characters/15/422168.jpg', // Gojo
  'https://cdn.myanimelist.net/images/characters/3/383022.jpg', // Nezuko
  'https://cdn.myanimelist.net/images/characters/15/534123.jpg', // Sung Jin-Woo
  'https://cdn.myanimelist.net/images/characters/6/524317.jpg', // Frieren
  'https://cdn.myanimelist.net/images/characters/4/491560.jpg', // Bocchi
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
  'Cultivation',
  'Martial Arts',
];

export const ProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const { watchlist, favorites } = useLists();
  const { currentLanguage, languages, setLanguage } = useLanguage();

  const [name, setName] = useState(user?.name || 'Otaku Voyager');
  const [avatar, setAvatar] = useState(user?.avatar || AVATARS[0]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    user?.favoriteGenres || ['Action', 'Fantasy', 'Romance']
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (token) {
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            avatar,
            favoriteGenres: selectedGenres,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          updateUser(data.user);
        }
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-purple-500 shadow-xl"
            />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                Level 1 Explorer
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email || 'user@animood.ai'}</p>

            {/* Quick stats */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Bookmark className="w-4 h-4 text-purple-400 fill-current" />
                <span>
                  <strong>{watchlist.length}</strong> in Watchlist
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Heart className="w-4 h-4 text-pink-400 fill-current" />
                <span>
                  <strong>{favorites.length}</strong> Favorites
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Choose Avatar
            </h3>
            <div className="flex flex-wrap gap-3">
              {AVATARS.map((av, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition ${
                    avatar === av ? 'border-purple-500 scale-105 shadow-md' : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Display Name
            </h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          {/* Favorite Genres Preference */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Favorite Genres
              </h3>
              <span className="text-xs text-purple-400">{selectedGenres.length} selected</span>
            </div>
            <p className="text-xs text-slate-400">
              AniMood AI factors these into your 7-factor recommendation model weights (20%).
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {GENRES.map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {g} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interface Language */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Preferred Platform Language (11 Supported)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition ${
                    currentLanguage.code === lang.code
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Profile preferences updated!</span>
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-900/50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
