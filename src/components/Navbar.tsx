import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Globe,
  Sun,
  Moon,
  User as UserIcon,
  Menu,
  X,
  Bookmark,
  Heart,
  History,
  TrendingUp,
  Dice5,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SurpriseModal } from './SurpriseModal';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t('nav_home', 'Home'), path: '/' },
    { label: '✨ ' + t('nav_discover', 'Discover'), path: '/discover', highlight: true },
    { label: t('nav_anime', 'Anime'), path: '/anime' },
    { label: t('nav_manga', 'Manga'), path: '/manga' },
    { label: t('nav_donghua', 'Donghua'), path: '/donghua' },
    { label: t('nav_manhwa', 'Manhwa'), path: '/manhwa' },
    { label: t('nav_manhua', 'Manhua'), path: '/manhua' },
    { label: t('nav_trending', 'Trending'), path: '/trending' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-md shadow-purple-900/40 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
                      AniMood
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white tracking-widest uppercase shadow-sm">
                      AI
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                    Mood-Based Discovery
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden xl:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                          : link.highlight
                          ? 'text-pink-400 hover:text-pink-300 hover:bg-pink-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Middle: Search Bar (Desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative flex-1 max-w-xs lg:max-w-sm"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder={t('nav_search_placeholder', 'Search Anime, Manhwa, Donghua...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-slate-100 placeholder-slate-500 transition"
              />
            </form>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Surprise Me Button */}
              <button
                type="button"
                onClick={() => setShowSurpriseModal(true)}
                title="Roll Surprise Recommendation"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/50 hover:border-purple-500 transition shadow-sm"
              >
                <Dice5 className="w-3.5 h-3.5 text-pink-400" />
                <span>{t('surprise_me', 'Surprise Me')}</span>
              </button>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition"
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">{currentLangObj.flag}</span>
                  <span className="text-[11px] uppercase font-bold">{currentLangObj.code}</span>
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Language
                    </p>
                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                            currentLanguage === lang.code
                              ? 'bg-purple-600/30 text-purple-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{lang.nativeName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-amber-400 transition"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* User Menu / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="hidden md:inline text-xs font-bold text-slate-200 pr-1 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 text-xs text-slate-200">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                        >
                          <UserIcon className="w-4 h-4 text-purple-400" />
                          <span>{t('nav_profile', 'Profile')}</span>
                        </Link>
                        <Link
                          to="/my-list"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                        >
                          <Bookmark className="w-4 h-4 text-purple-400" />
                          <span>{t('nav_my_list', 'My Watchlist')}</span>
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                        >
                          <Heart className="w-4 h-4 text-pink-400" />
                          <span>{t('nav_favorites', 'Favorites')}</span>
                        </Link>
                        <Link
                          to="/mood-history"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                        >
                          <History className="w-4 h-4 text-blue-400" />
                          <span>{t('nav_mood_history', 'Mood History')}</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>{t('nav_settings', 'Settings')}</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('nav_logout', 'Logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition"
                  >
                    {t('nav_login', 'Login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-900/40 transition"
                  >
                    {t('nav_register', 'Join Free')}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder={t('nav_search_placeholder', 'Search titles, genres, creators...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                    location.pathname === link.path
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowSurpriseModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/60 text-purple-300 text-xs font-bold border border-purple-800/40"
              >
                <Dice5 className="w-4 h-4 text-pink-400" />
                <span>Surprise Me 🎲</span>
              </button>

              <Link
                to="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-pink-400"
              >
                <Heart className="w-4 h-4 text-pink-500" />
                <span>Favorites</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Surprise Me Modal */}
      <SurpriseModal isOpen={showSurpriseModal} onClose={() => setShowSurpriseModal(false)} />
    </>
  );
};
