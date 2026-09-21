import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Film, BookOpen, Compass, Heart, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                AniMood <span className="text-purple-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-300 font-medium text-xs leading-relaxed">
              “Tell us how you feel. We'll find what you should watch or read.”
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              An intelligent entertainment discovery system uniting Anime, Manga, Donghua, Manhwa, and Manhua under a 7-factor mood matrix.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-purple-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>B.Tech IT Final Year Project</span>
            </div>
          </div>

          {/* Col 2: Content Formats */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Media Universes
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/anime" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <span>🇯🇵</span> Anime (Japanese Animation)
                </Link>
              </li>
              <li>
                <Link to="/manga" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <span>🇯🇵</span> Manga (Japanese Comics)
                </Link>
              </li>
              <li>
                <Link to="/donghua" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <span>🇨🇳</span> Donghua (Chinese Animation)
                </Link>
              </li>
              <li>
                <Link to="/manhwa" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <span>🇰🇷</span> Manhwa (Korean Webtoons)
                </Link>
              </li>
              <li>
                <Link to="/manhua" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <span>🇨🇳</span> Manhua (Chinese Comics)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Discovery & Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Discovery
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/discover" className="hover:text-pink-400 transition flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-pink-400" />
                  6-Step Mood Recommender
                </Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-purple-400" />
                  Trending Across 5 Formats
                </Link>
              </li>
              <li>
                <Link to="/mood-history" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Personal Mood Timeline
                </Link>
              </li>
              <li>
                <Link to="/my-list" className="hover:text-purple-400 transition flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  Watchlist & Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Platforms & Ethics */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official & Legal Media</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AniMood AI strictly champions the creators and official distributors. Recommends official streaming and reading platforms including Crunchyroll, Netflix, Webtoon, Bilibili, MangaPlus, and KakaoPage.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Disclaimer:</strong> Entertainment recommendation engine only. Does not host pirated streams or make clinical psychiatric assessments.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AniMood AI. Built with React, Tailwind CSS, Express, and Google Gemini.</p>
          <div className="flex items-center gap-4">
            <Link to="/discover" className="hover:text-slate-300 transition">
              Find My Recommendation
            </Link>
            <span>•</span>
            <Link to="/settings" className="hover:text-slate-300 transition">
              Preferences
            </Link>
            <span>•</span>
            <span className="text-slate-400">11 Languages Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
