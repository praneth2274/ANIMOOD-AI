import { ContentItem, RecommendationRequest, RecommendationScoreResult, User } from '../types.js';
import { dbStore } from '../db/store.js';

export function calculateRecommendationScore(
  item: ContentItem,
  request: RecommendationRequest,
  user?: User
): RecommendationScoreResult {
  // 1. Mood Match (25%)
  let moodAffinity = item.moodAffinities[request.mood] || 0;
  if (!moodAffinity) {
    // Heuristic fallbacks
    const g = item.genres;
    if (request.mood === 'Happy' && (g.includes('Comedy') || g.includes('Slice of Life'))) moodAffinity = 0.85;
    else if (request.mood === 'Sad' && (g.includes('Drama') || g.includes('Romance'))) moodAffinity = 0.88;
    else if (request.mood === 'Motivated' && (g.includes('Sports') || g.includes('Action'))) moodAffinity = 0.9;
    else if (request.mood === 'Romantic' && g.includes('Romance')) moodAffinity = 0.95;
    else if (request.mood === 'Curious' && (g.includes('Mystery') || g.includes('Sci-Fi'))) moodAffinity = 0.9;
    else if (request.mood === 'Stressed' && (g.includes('Comedy') || g.includes('Slice of Life'))) moodAffinity = 0.82;
    else if (request.mood === 'Excited' && (g.includes('Action') || g.includes('Fantasy'))) moodAffinity = 0.88;
    else moodAffinity = 0.65;
  }
  const moodMatch = Math.round(moodAffinity * 25 * 10) / 10;

  // 2. Genre Match (20%)
  let genreMatch = 0;
  if (!request.genres || request.genres.length === 0) {
    genreMatch = 16;
  } else {
    const matchedGenres = request.genres.filter((g) =>
      item.genres.some((ig) => ig.toLowerCase() === g.toLowerCase())
    );
    const matchRatio = matchedGenres.length / request.genres.length;
    // Base bonus for having at least 1 match
    if (matchedGenres.length > 0) {
      genreMatch = Math.min(20, Math.round((0.5 + 0.5 * matchRatio) * 20 * 10) / 10);
    } else {
      genreMatch = 6;
    }
  }

  // 3. Situation Match (15%)
  let situationAffinity = item.situationAffinities[request.situation] || 0;
  if (!situationAffinity) {
    if (request.situation === 'Before Sleep' && (item.genres.includes('Slice of Life') || item.genres.includes('Drama'))) situationAffinity = 0.85;
    else if (request.situation === 'After College' && (item.genres.includes('Comedy') || item.genres.includes('Action'))) situationAffinity = 0.88;
    else if (request.situation === 'Studying' && item.genres.includes('Slice of Life')) situationAffinity = 0.8;
    else if (request.situation === 'Weekend') situationAffinity = 0.9;
    else situationAffinity = 0.7;
  }
  const situationMatch = Math.round(situationAffinity * 15 * 10) / 10;

  // 4. State / Energy Match (10%)
  let energyAffinity = item.energyAffinities[request.state] || 0;
  if (!energyAffinity) {
    if (request.state === 'High Energy' && item.genres.includes('Action')) energyAffinity = 0.9;
    else if (request.state === 'Low Energy' && (item.genres.includes('Slice of Life') || item.genres.includes('Comedy'))) energyAffinity = 0.85;
    else if (request.state === 'Focused' && (item.genres.includes('Psychological') || item.genres.includes('Mystery'))) energyAffinity = 0.92;
    else energyAffinity = 0.75;
  }
  const stateMatch = Math.round(energyAffinity * 10 * 10) / 10;

  // 5. User History & Preferences (15%)
  let historyMatch = 11;
  if (user) {
    let bonus = 0;
    // Favorite genres alignment
    if (user.favoriteGenres && user.favoriteGenres.length > 0) {
      const userGenreMatches = user.favoriteGenres.filter((ug) =>
        item.genres.some((ig) => ig.toLowerCase() === ug.toLowerCase())
      );
      bonus += Math.min(3, userGenreMatches.length * 1.5);
    }
    // Favorite content types
    if (user.favoriteContentTypes && user.favoriteContentTypes.includes(item.contentType)) {
      bonus += 2;
    }
    // If user has rated or marked favorites
    if (user.favorites && user.favorites.includes(item.contentId)) {
      bonus += 1;
    }
    historyMatch = Math.min(15, 10 + bonus);
  }

  // 6. Rating & Popularity (10%)
  const ratingNormalized = (item.rating / 10) * 6; // 0 to 6
  const popularityNormalized = (item.popularity / 100) * 4; // 0 to 4
  const popularityRating = Math.round((ratingNormalized + popularityNormalized) * 10) / 10;

  // 7. Language Match (5%)
  let languageMatch = 4.5;
  const langLower = (request.language || 'English').toLowerCase();
  if (langLower === 'japanese' && item.country === 'Japan') languageMatch = 5.0;
  else if (langLower === 'chinese' && item.country === 'China') languageMatch = 5.0;
  else if (langLower === 'korean' && item.country === 'South Korea') languageMatch = 5.0;
  else if (langLower === 'english') languageMatch = 4.8;
  else languageMatch = 4.5;

  const rawTotal = moodMatch + genreMatch + situationMatch + stateMatch + historyMatch + popularityRating + languageMatch;
  const finalScore = Math.min(99, Math.max(70, Math.round(rawTotal)));

  // Generate personalized explanation
  const explanation = generateRuleBasedExplanation(item, request);

  return {
    content: item,
    finalScore,
    breakdown: {
      moodMatch,
      genreMatch,
      situationMatch,
      stateMatch,
      historyMatch,
      popularityRating,
      languageMatch,
    },
    explanation,
  };
}

export function generateRuleBasedExplanation(item: ContentItem, request: RecommendationRequest): string {
  const genreList = item.genres.slice(0, 3).join(', ');
  const countryName = item.country;
  const mediaLabel = item.contentType.toUpperCase();

  return `You selected ${request.mood} + ${request.situation} + ${request.state}. ${item.title} (${mediaLabel}) aligns with your current headspace because its ${genreList} elements and ${item.status.toLowerCase()} storyline provide the ideal pace for your entertainment preference.`;
}

export function getPersonalizedRecommendations(
  request: RecommendationRequest,
  user?: User
): {
  bestMatch: RecommendationScoreResult;
  anime: RecommendationScoreResult[];
  manga: RecommendationScoreResult[];
  donghua: RecommendationScoreResult[];
  manhwa: RecommendationScoreResult[];
  manhua: RecommendationScoreResult[];
  hiddenGems: RecommendationScoreResult[];
  trendingMatches: RecommendationScoreResult[];
  allRanked: RecommendationScoreResult[];
} {
  const allItems = dbStore.getAllContent();

  // Filter by requested content type if specific
  const candidateItems = request.contentType === 'All'
    ? allItems
    : allItems.filter((i) => i.contentType.toLowerCase() === request.contentType.toLowerCase());

  // Score all candidates
  const scoredItems: RecommendationScoreResult[] = candidateItems
    .map((item) => calculateRecommendationScore(item, request, user))
    .sort((a, b) => b.finalScore - a.finalScore);

  const bestMatch = scoredItems[0] || calculateRecommendationScore(allItems[0], request, user);

  // Categorized
  const allScored = allItems.map((item) => calculateRecommendationScore(item, request, user));
  allScored.sort((a, b) => b.finalScore - a.finalScore);

  const anime = allScored.filter((s) => s.content.contentType === 'anime');
  const manga = allScored.filter((s) => s.content.contentType === 'manga');
  const donghua = allScored.filter((s) => s.content.contentType === 'donghua');
  const manhwa = allScored.filter((s) => s.content.contentType === 'manhwa');
  const manhua = allScored.filter((s) => s.content.contentType === 'manhua');

  const hiddenGems = allScored.filter((s) => s.content.isHiddenGem || s.content.popularity < 95).slice(0, 4);
  const trendingMatches = allScored.filter((s) => s.content.isTrending).slice(0, 4);

  return {
    bestMatch,
    anime: anime.slice(0, 4),
    manga: manga.slice(0, 4),
    donghua: donghua.slice(0, 4),
    manhwa: manhwa.slice(0, 4),
    manhua: manhua.slice(0, 4),
    hiddenGems,
    trendingMatches,
    allRanked: scoredItems,
  };
}
