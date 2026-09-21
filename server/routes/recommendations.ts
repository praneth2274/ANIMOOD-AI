import express from 'express';
import { dbStore } from '../db/store.js';
import { getPersonalizedRecommendations, calculateRecommendationScore } from '../services/recommendationEngine.js';
import { generateAiExplanation } from '../services/geminiAi.js';
import { optionalAuthenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { MoodType, SituationType, EnergyStateType, ContentType } from '../types.js';

const router = express.Router();

// POST /api/recommendations
router.post('/recommendations', optionalAuthenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      mood = 'Happy',
      situation = 'At Home',
      state = 'Medium Energy',
      genres = [],
      contentType = 'All',
      language = 'English',
    } = req.body;

    const request = {
      mood: mood as MoodType,
      situation: situation as SituationType,
      state: state as EnergyStateType,
      genres: Array.isArray(genres) ? genres : [],
      contentType: contentType as ContentType | 'All',
      language: language as string,
    };

    const results = getPersonalizedRecommendations(request, req.user);

    // Generate AI explanation for the best match using Gemini
    try {
      const aiExplanation = await generateAiExplanation(results.bestMatch.content, request);
      results.bestMatch.explanation = aiExplanation;
    } catch (err) {
      console.warn('AI explanation generation skipped:', err);
    }

    // If user is authenticated, log to MoodHistory
    if (req.user) {
      const recommendedIds = results.allRanked.slice(0, 10).map((r) => r.content.contentId);
      dbStore.addMoodHistory(req.user.id, {
        mood: request.mood,
        situation: request.situation,
        state: request.state,
        genres: request.genres,
        contentType: request.contentType,
        language: request.language,
        recommendedIds,
      });
    }

    res.json({
      request,
      results,
    });
  } catch (err: any) {
    console.error('Recommendation engine error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// GET /api/recommendations/personalized
router.get('/recommendations/personalized', optionalAuthenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const request = {
      mood: 'Motivated' as MoodType,
      situation: 'Free Time' as SituationType,
      state: 'Medium Energy' as EnergyStateType,
      genres: user?.favoriteGenres || ['Action', 'Adventure', 'Fantasy'],
      contentType: 'All' as const,
      language: user?.preferredLanguage || 'English',
    };

    const results = getPersonalizedRecommendations(request, user);
    res.json({ request, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load personalized recommendations' });
  }
});

// GET /api/recommendations/surprise (Section 18)
router.get('/recommendations/surprise', optionalAuthenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const moods: MoodType[] = ['Happy', 'Motivated', 'Curious', 'Excited', 'Relaxed', 'Emotional', 'Bored'];
    const situations: SituationType[] = ['Weekend', 'After College', 'Free Time', 'At Home', 'Before Sleep'];
    const states: EnergyStateType[] = ['High Energy', 'Medium Energy', 'Relaxed', 'Focused'];

    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const randomSituation = situations[Math.floor(Math.random() * situations.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];

    const allContent = dbStore.getAllContent();
    const randomItem = allContent[Math.floor(Math.random() * allContent.length)];

    const request = {
      mood: randomMood,
      situation: randomSituation,
      state: randomState,
      genres: randomItem.genres.slice(0, 2),
      contentType: 'All' as const,
      language: 'English',
    };

    const scored = calculateRecommendationScore(randomItem, request, req.user);
    scored.explanation = await generateAiExplanation(randomItem, request);

    res.json({
      surpriseQuery: request,
      match: scored,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to surprise with recommendation' });
  }
});

// POST /api/ai/explain (Section 7)
router.post('/ai/explain', async (req, res) => {
  try {
    const { contentId, mood, situation, state, genres, language } = req.body;
    const item = dbStore.getContentById(contentId);
    if (!item) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const request = {
      mood: (mood as MoodType) || 'Curious',
      situation: (situation as SituationType) || 'Free Time',
      state: (state as EnergyStateType) || 'Medium Energy',
      genres: Array.isArray(genres) ? genres : item.genres,
      contentType: item.contentType,
      language: language || 'English',
    };

    const explanation = await generateAiExplanation(item, request);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

export default router;
