import fs from 'fs';
import path from 'path';
import { ContentItem, User, MoodType, SituationType, EnergyStateType, ContentType, WatchlistStatus } from '../types.js';
import { INITIAL_CONTENT } from '../data/contentData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'db_store.json');

interface DatabaseSchema {
  users: User[];
  content: ContentItem[];
  ratings: Array<{
    id: string;
    userId: string;
    contentId: string;
    contentType: ContentType;
    rating: number;
    createdAt: string;
  }>;
  moodHistory: Array<{
    id: string;
    userId: string;
    mood: MoodType;
    situation: SituationType;
    state: EnergyStateType;
    genres: string[];
    contentType: ContentType | 'All';
    language: string;
    recommendedIds: string[];
    createdAt: string;
  }>;
}

class DatabaseStore {
  private data: DatabaseSchema = {
    users: [],
    content: [],
    ratings: [],
    moodHistory: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data.content = [...INITIAL_CONTENT];
        this.save();
      }

      // Ensure content is seeded if empty or missing new items
      if (!this.data.content || this.data.content.length === 0) {
        this.data.content = [...INITIAL_CONTENT];
        this.save();
      } else {
        // Merge missing items
        for (const item of INITIAL_CONTENT) {
          if (!this.data.content.some((c) => c.contentId === item.contentId)) {
            this.data.content.push(item);
          }
        }
        this.save();
      }
    } catch (err) {
      console.warn('Database initialization warning, using memory fallback:', err);
      this.data.content = [...INITIAL_CONTENT];
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // --- CONTENT METHODS ---
  public getAllContent(): ContentItem[] {
    return this.data.content;
  }

  public getContentById(id: string): ContentItem | undefined {
    return this.data.content.find(
      (item) => item.contentId.toLowerCase() === id.toLowerCase()
    );
  }

  public getContentByType(type: ContentType): ContentItem[] {
    return this.data.content.filter(
      (item) => item.contentType.toLowerCase() === type.toLowerCase()
    );
  }

  public getTrending(type?: ContentType): ContentItem[] {
    let items = this.data.content;
    if (type) {
      items = items.filter((i) => i.contentType.toLowerCase() === type.toLowerCase());
    }
    return [...items].sort((a, b) => b.popularity - a.popularity);
  }

  public getTopRated(type?: ContentType): ContentItem[] {
    let items = this.data.content;
    if (type) {
      items = items.filter((i) => i.contentType.toLowerCase() === type.toLowerCase());
    }
    return [...items].sort((a, b) => b.rating - a.rating);
  }

  public getFamousMasterpieces(type?: ContentType): ContentItem[] {
    let items = this.data.content.filter((i) => i.isTopRated || (i.rank && i.rank <= 25) || i.popularity >= 96);
    if (type) {
      items = items.filter((i) => i.contentType.toLowerCase() === type.toLowerCase());
    }
    return [...items].sort((a, b) => {
      // Prioritize rank if both have it, else rating
      if (a.rank && b.rank) return a.rank - b.rank;
      return b.rating - a.rating;
    });
  }

  public getHiddenGems(type?: ContentType): ContentItem[] {
    let items = this.data.content.filter((i) => i.isHiddenGem || i.popularity < 95);
    if (type) {
      items = items.filter((i) => i.contentType.toLowerCase() === type.toLowerCase());
    }
    return [...items].sort((a, b) => b.rating - a.rating);
  }

  public searchContent(query: string, filters?: {
    contentType?: string;
    genre?: string;
    status?: string;
    country?: string;
  }): ContentItem[] {
    const q = (query || '').trim().toLowerCase();
    return this.data.content.filter((item) => {
      // Check query match across title, alternative titles, description, characters, author, artist
      const matchesQuery = !q || (
        item.title.toLowerCase().includes(q) ||
        (item.alternativeTitles.english && item.alternativeTitles.english.toLowerCase().includes(q)) ||
        (item.alternativeTitles.japanese && item.alternativeTitles.japanese.toLowerCase().includes(q)) ||
        (item.alternativeTitles.chinese && item.alternativeTitles.chinese.toLowerCase().includes(q)) ||
        (item.alternativeTitles.korean && item.alternativeTitles.korean.toLowerCase().includes(q)) ||
        (item.alternativeTitles.romaji && item.alternativeTitles.romaji.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        item.genres.some((g) => g.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.artist && item.artist.toLowerCase().includes(q)) ||
        (item.studio && item.studio.toLowerCase().includes(q)) ||
        (item.characters && item.characters.some((c) => c.name.toLowerCase().includes(q)))
      );

      if (!matchesQuery) return false;

      if (filters?.contentType && filters.contentType !== 'all' && item.contentType.toLowerCase() !== filters.contentType.toLowerCase()) {
        return false;
      }

      if (filters?.genre && filters.genre !== 'all' && !item.genres.some((g) => g.toLowerCase() === filters.genre?.toLowerCase())) {
        return false;
      }

      if (filters?.status && filters.status !== 'all' && item.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      if (filters?.country && filters.country !== 'all' && item.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }

      return true;
    });
  }

  // --- USER & AUTH METHODS ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: Partial<User>): User {
    const newUser: User = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      name: userData.name || 'Explorer',
      email: userData.email || '',
      password: userData.password || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.name || 'User'}`,
      preferredLanguage: userData.preferredLanguage || 'English',
      favoriteGenres: userData.favoriteGenres || [],
      favoriteContentTypes: userData.favoriteContentTypes || ['anime', 'manga', 'manhwa', 'donghua', 'manhua'],
      onboardingCompleted: userData.onboardingCompleted ?? false,
      favorites: [],
      watchlist: [],
      history: [],
      moodHistory: [],
      ratings: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  // --- FAVORITES METHODS ---
  public toggleFavorite(userId: string, contentId: string): { isFavorite: boolean; favorites: string[] } {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    const index = user.favorites.indexOf(contentId);
    let isFavorite = false;
    if (index > -1) {
      user.favorites.splice(index, 1);
      isFavorite = false;
    } else {
      user.favorites.push(contentId);
      isFavorite = true;
    }
    user.updatedAt = new Date().toISOString();
    this.save();
    return { isFavorite, favorites: user.favorites };
  }

  public getUserFavorites(userId: string): ContentItem[] {
    const user = this.findUserById(userId);
    if (!user) return [];
    return this.data.content.filter((item) => user.favorites.includes(item.contentId));
  }

  // --- WATCHLIST METHODS ---
  public setWatchlist(
    userId: string,
    contentId: string,
    contentType: ContentType,
    status: WatchlistStatus,
    progress?: number
  ) {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    const existingIndex = user.watchlist.findIndex((w) => w.contentId === contentId);
    if (existingIndex > -1) {
      user.watchlist[existingIndex].status = status;
      if (progress !== undefined) user.watchlist[existingIndex].progress = progress;
    } else {
      user.watchlist.push({
        contentId,
        contentType,
        status,
        addedAt: new Date().toISOString(),
        progress: progress || 0,
      });
    }
    user.updatedAt = new Date().toISOString();
    this.save();
    return user.watchlist;
  }

  public removeFromWatchlist(userId: string, contentId: string) {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');
    user.watchlist = user.watchlist.filter((w) => w.contentId !== contentId);
    user.updatedAt = new Date().toISOString();
    this.save();
    return user.watchlist;
  }

  // --- RATINGS METHODS ---
  public rateContent(userId: string, contentId: string, contentType: ContentType, rating: number) {
    const user = this.findUserById(userId);
    if (user) {
      user.ratings[contentId] = rating;
      user.updatedAt = new Date().toISOString();
    }

    const ratingRecord = {
      id: 'rating_' + Date.now(),
      userId,
      contentId,
      contentType,
      rating,
      createdAt: new Date().toISOString(),
    };
    this.data.ratings.push(ratingRecord);
    this.save();
    return ratingRecord;
  }

  public getContentRatings(contentId: string) {
    const ratings = this.data.ratings.filter((r) => r.contentId === contentId);
    const avg = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : null;
    return { count: ratings.length, average: avg ? Number(avg.toFixed(1)) : null };
  }

  // --- MOOD HISTORY ---
  public addMoodHistory(
    userId: string,
    entry: {
      mood: MoodType;
      situation: SituationType;
      state: EnergyStateType;
      genres: string[];
      contentType: ContentType | 'All';
      language: string;
      recommendedIds: string[];
    }
  ) {
    const record = {
      id: 'mood_' + Date.now(),
      userId,
      ...entry,
      createdAt: new Date().toISOString(),
    };
    this.data.moodHistory.unshift(record);

    const user = this.findUserById(userId);
    if (user) {
      if (!user.moodHistory) user.moodHistory = [];
      user.moodHistory.unshift(record);
      if (user.moodHistory.length > 50) user.moodHistory.pop();
    }

    this.save();
    return record;
  }

  public getMoodHistory(userId: string) {
    return this.data.moodHistory.filter((m) => m.userId === userId);
  }
}

export const dbStore = new DatabaseStore();
