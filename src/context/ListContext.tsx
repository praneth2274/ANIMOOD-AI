import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { ContentType, WatchlistStatus, ContentItem } from '../types';

interface WatchlistItem {
  contentId: string;
  contentType: ContentType;
  status: WatchlistStatus;
  addedAt: string;
  progress?: number;
  content?: ContentItem;
}

interface ListContextType {
  favorites: string[];
  watchlist: WatchlistItem[];
  toggleFavorite: (contentId: string) => Promise<boolean>;
  isFavorite: (contentId: string) => boolean;
  setWatchlistStatus: (contentId: string, contentType: ContentType, status: WatchlistStatus, progress?: number) => Promise<void>;
  removeFromWatchlist: (contentId: string) => Promise<void>;
  getWatchlistEntry: (contentId: string) => WatchlistItem | undefined;
  refreshLists: () => Promise<void>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('animood_guest_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('animood_guest_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const refreshLists = async () => {
    if (token && user) {
      try {
        const [favRes, watchRes] = await Promise.all([
          fetch('/api/user/favorites', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/user/watchlist', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (favRes.ok) {
          const favData = await favRes.json();
          setFavorites(favData.data.map((item: ContentItem) => item.contentId));
        }

        if (watchRes.ok) {
          const watchData = await watchRes.json();
          setWatchlist(watchData.data);
        }
      } catch (err) {
        console.warn('Failed to sync user lists:', err);
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      refreshLists();
    }
  }, [user?.id, token]);

  const toggleFavorite = async (contentId: string): Promise<boolean> => {
    if (token) {
      try {
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ contentId }),
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data.favorites);
          return data.isFavorite;
        }
      } catch (err) {
        console.error('Error toggling favorite:', err);
      }
    }

    // Guest fallback
    let newFavs: string[];
    let newState = false;
    if (favorites.includes(contentId)) {
      newFavs = favorites.filter((id) => id !== contentId);
      newState = false;
    } else {
      newFavs = [...favorites, contentId];
      newState = true;
    }
    setFavorites(newFavs);
    localStorage.setItem('animood_guest_favorites', JSON.stringify(newFavs));
    return newState;
  };

  const isFavorite = (contentId: string) => {
    return favorites.includes(contentId);
  };

  const setWatchlistStatus = async (
    contentId: string,
    contentType: ContentType,
    status: WatchlistStatus,
    progress?: number
  ) => {
    if (token) {
      try {
        const res = await fetch('/api/user/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ contentId, contentType, status, progress }),
        });
        if (res.ok) {
          refreshLists();
          return;
        }
      } catch (err) {
        console.error('Error updating watchlist:', err);
      }
    }

    // Guest fallback
    const existingIndex = watchlist.findIndex((w) => w.contentId === contentId);
    let updated = [...watchlist];
    if (existingIndex > -1) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        status,
        progress: progress !== undefined ? progress : updated[existingIndex].progress,
      };
    } else {
      updated.push({
        contentId,
        contentType,
        status,
        addedAt: new Date().toISOString(),
        progress: progress || 0,
      });
    }
    setWatchlist(updated);
    localStorage.setItem('animood_guest_watchlist', JSON.stringify(updated));
  };

  const removeFromWatchlist = async (contentId: string) => {
    if (token) {
      try {
        const res = await fetch(`/api/user/watchlist/${contentId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          refreshLists();
          return;
        }
      } catch (err) {
        console.error('Error removing from watchlist:', err);
      }
    }

    const updated = watchlist.filter((w) => w.contentId !== contentId);
    setWatchlist(updated);
    localStorage.setItem('animood_guest_watchlist', JSON.stringify(updated));
  };

  const getWatchlistEntry = (contentId: string) => {
    return watchlist.find((w) => w.contentId === contentId);
  };

  return (
    <ListContext.Provider
      value={{
        favorites,
        watchlist,
        toggleFavorite,
        isFavorite,
        setWatchlistStatus,
        removeFromWatchlist,
        getWatchlistEntry,
        refreshLists,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export function useLists() {
  const context = useContext(ListContext);
  if (!context) throw new Error('useLists must be used within ListProvider');
  return context;
}
