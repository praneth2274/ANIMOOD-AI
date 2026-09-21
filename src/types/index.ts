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
  relation: string;
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
  rating: number;
  rank?: number;
  popularity: number;
  releaseDate: string;
  releaseYear: number;
  status: 'Airing' | 'Finished' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Hiatus';
  episodes?: number;
  duration?: string;
  chapters?: number;
  volumes?: number;
  author?: string;
  artist?: string;
  studio?: string;
  producers?: string[];
  characters?: CharacterInfo[];
  relatedContent?: RelatedContentItem[];
  moodAffinities: Record<string, number>;
  situationAffinities: Record<string, number>;
  energyAffinities: Record<string, number>;
  isTrending?: boolean;
  isTopRated?: boolean;
  isHiddenGem?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferredLanguage: string;
  favoriteGenres: string[];
  favoriteContentTypes: ContentType[];
  onboardingCompleted: boolean;
  favorites: string[];
  watchlist: Array<{
    contentId: string;
    contentType: ContentType;
    status: WatchlistStatus;
    addedAt: string;
    progress?: number;
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
  ratings: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationScoreResult {
  content: ContentItem;
  finalScore: number;
  breakdown: {
    moodMatch: number;
    genreMatch: number;
    situationMatch: number;
    stateMatch: number;
    historyMatch: number;
    popularityRating: number;
    languageMatch: number;
  };
  explanation: string;
}

export interface RecommendationResponse {
  request: {
    mood: MoodType;
    situation: SituationType;
    state: EnergyStateType;
    genres: string[];
    contentType: ContentType | 'All';
    language: string;
  };
  results: {
    bestMatch: RecommendationScoreResult;
    anime: RecommendationScoreResult[];
    manga: RecommendationScoreResult[];
    donghua: RecommendationScoreResult[];
    manhwa: RecommendationScoreResult[];
    manhua: RecommendationScoreResult[];
    hiddenGems: RecommendationScoreResult[];
    trendingMatches: RecommendationScoreResult[];
    allRanked: RecommendationScoreResult[];
  };
}

export interface MoodHistoryEntry {
  id: string;
  timestamp: string;
  mood: MoodType;
  situation: SituationType;
  state: EnergyStateType;
  recommendationsCount: number;
  topPickTitle?: string;
}
