export type ContentType = 'anime' | 'manga' | 'donghua' | 'manhwa' | 'manhua';

export type MoodType =
  | 'Happy'
  | 'Sad'
  | 'Angry'
  | 'Stressed'
  | 'Relaxed'
  | 'Motivated'
  | 'Romantic'
  | 'Bored'
  | 'Scared'
  | 'Excited'
  | 'Emotional'
  | 'Curious';

export type SituationType =
  | 'After College'
  | 'Studying'
  | 'Before Sleep'
  | 'Travelling'
  | 'At Home'
  | 'Weekend'
  | 'Stressful Day'
  | 'Emotional Day'
  | 'Party Mood'
  | 'Free Time';

export type EnergyStateType =
  | 'Low Energy'
  | 'Medium Energy'
  | 'High Energy'
  | 'Emotional'
  | 'Focused'
  | 'Curious'
  | 'Relaxed';

export type WatchlistStatus =
  | 'Watching'
  | 'Completed'
  | 'Plan to Watch'
  | 'Reading'
  | 'Completed Reading'
  | 'Plan to Read';

export interface CharacterInfo {
  name: string;
  role: string;
  image: string;
}

export interface RelatedContentItem {
  id: string;
  title: string;
  contentType: ContentType;
  relation: string; // e.g., 'Adaptation', 'Original', 'Spinoff', 'Prequel', 'Alternative Media'
  image: string;
}

export interface ContentItem {
  contentId: string;
  title: string;
  alternativeTitles: {
    english?: string;
    japanese?: string;
    chinese?: string;
    korean?: string;
    romaji?: string;
    synonyms?: string[];
  };
  contentType: ContentType;
  country: 'Japan' | 'China' | 'South Korea';
  countryCode: 'JP' | 'CN' | 'KR';
  language: string;
  description: string;
  image: string;
  banner: string;
  trailer: {
    youtubeId?: string;
    embedUrl?: string;
    title?: string;
    available: boolean;
  };
  genres: string[];
  rating: number; // out of 10
  rank?: number;
  popularity: number; // e.g. 95
  releaseDate: string;
  releaseYear: number;
  status: 'Airing' | 'Finished' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Hiatus';
  episodes?: number;
  duration?: string; // e.g. "24 min/ep"
  chapters?: number;
  volumes?: number;
  author?: string;
  artist?: string;
  studio?: string;
  producers?: string[];
  characters?: CharacterInfo[];
  relatedContent?: RelatedContentItem[];
  // Mood / Situation affinities for AI scoring algorithm
  moodAffinities: Record<string, number>; // e.g. { Motivated: 0.95, Excited: 0.9 }
  situationAffinities: Record<string, number>; // e.g. { 'After College': 0.85 }
  energyAffinities: Record<string, number>; // e.g. { 'High Energy': 0.9 }
  isTrending?: boolean;
  isTopRated?: boolean;
  isHiddenGem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // hashed with bcrypt
  avatar?: string;
  preferredLanguage: string;
  favoriteGenres: string[];
  favoriteContentTypes: ContentType[];
  onboardingCompleted: boolean;
  favorites: string[]; // contentId list
  watchlist: Array<{
    contentId: string;
    contentType: ContentType;
    status: WatchlistStatus;
    addedAt: string;
    progress?: number;
  }>;
  history: Array<{
    contentId: string;
    viewedAt: string;
  }>;
  moodHistory: Array<{
    id: string;
    mood: MoodType;
    situation: SituationType;
    state: EnergyStateType;
    genres: string[];
    contentType: ContentType | 'All';
    language: string;
    recommendedIds: string[];
    createdAt: string;
  }>;
  ratings: Record<string, number>; // contentId -> rating (1-5)
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationRequest {
  mood: MoodType;
  situation: SituationType;
  state: EnergyStateType;
  genres: string[];
  contentType: ContentType | 'All';
  language: string;
}

export interface RecommendationScoreResult {
  content: ContentItem;
  finalScore: number; // 0-100%
  breakdown: {
    moodMatch: number; // 25% max
    genreMatch: number; // 20% max
    situationMatch: number; // 15% max
    stateMatch: number; // 10% max
    historyMatch: number; // 15% max
    popularityRating: number; // 10% max
    languageMatch: number; // 5% max
  };
  explanation: string;
}
