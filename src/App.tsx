import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ListProvider } from './context/ListContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';

import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CategoryPage } from './pages/CategoryPage';
import { DetailsPage } from './pages/DetailsPage';
import { SearchPage } from './pages/SearchPage';
import { TrendingPage } from './pages/TrendingPage';
import { MyListPage } from './pages/MyListPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MoodHistoryPage } from './pages/MoodHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem('animood_onboarding_completed');
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ListProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
                <Navbar />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />

                    {/* 5 Primary Categories */}
                    <Route path="/anime" element={<CategoryPage forcedType="anime" />} />
                    <Route path="/manga" element={<CategoryPage forcedType="manga" />} />
                    <Route path="/donghua" element={<CategoryPage forcedType="donghua" />} />
                    <Route path="/manhwa" element={<CategoryPage forcedType="manhwa" />} />
                    <Route path="/manhua" element={<CategoryPage forcedType="manhua" />} />

                    {/* Item Details View */}
                    <Route path="/:category/:id" element={<DetailsPage />} />

                    {/* Search & Discovery */}
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/trending" element={<TrendingPage />} />

                    {/* User Lists & History */}
                    <Route path="/my-list" element={<MyListPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/mood-history" element={<MoodHistoryPage />} />

                    {/* Account & Preferences */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                <Footer />

                {/* First-time visitor onboarding questionnaire */}
                <OnboardingModal
                  isOpen={showOnboarding}
                  onClose={() => setShowOnboarding(false)}
                />
              </div>
            </BrowserRouter>
          </ListProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
