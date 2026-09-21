import React, { useState } from 'react';
import { Settings, Globe, Moon, Sun, Shield, Trash2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { currentLanguage, languages, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear your local recommendations and guest history?')) {
      sessionStorage.removeItem('animood_last_recommendation');
      localStorage.removeItem('animood_guest_history');
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-purple-400" />
            <h1 className="text-3xl font-black text-white">Platform Settings</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your localized language, appearance, and local storage preferences.
          </p>
        </div>

        {/* 1. Language Preferences */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Interface Language</h3>
              <p className="text-xs text-slate-400">
                AniMood AI supports 11 Indian and international languages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition text-left ${
                  currentLanguage.code === lang.code
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="min-w-0">
                  <p className="truncate">{lang.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{lang.nativeName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Appearance */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-purple-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
              <div>
                <h3 className="text-sm font-bold text-white">Display Theme</h3>
                <p className="text-xs text-slate-400">
                  Current theme is optimized for visual comfort during late night reads.
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 transition"
            >
              Toggle to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* 3. Storage & Cache Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Reset Local Session Cache</h3>
                <p className="text-xs text-slate-400">
                  Clears temporarily stored recommendation results and guest session history.
                </p>
              </div>
            </div>

            <button
              onClick={handleClearData}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition"
            >
              Clear Cache
            </button>
          </div>
          {cleared && (
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Local session cache cleared successfully.</span>
            </p>
          )}
        </div>

        {/* 4. Academic & Ethics Statement */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Academic & Ethical Guidelines</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AniMood AI was created as a B.Tech IT final-year project and portfolio system. It is strictly an entertainment recommendation engine connecting users to official media services (Crunchyroll, Netflix, Webtoon, Bilibili, MangaPlus, KakaoPage). It does not host copyrighted media, nor does it provide clinical psychological diagnoses.
          </p>
        </div>
      </div>
    </div>
  );
};
