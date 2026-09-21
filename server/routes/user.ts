import express from 'express';
import { dbStore } from '../db/store.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { ContentType, WatchlistStatus, MoodType, SituationType, EnergyStateType } from '../types.js';

const router = express.Router();

// ================= FAVORITES =================
// GET /api/user/favorites
router.get('/user/favorites', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const items = dbStore.getUserFavorites(req.user.id);
  res.json({ count: items.length, data: items });
});

// POST /api/user/favorites
router.post('/user/favorites', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { contentId } = req.body;
  if (!contentId) return res.status(400).json({ error: 'contentId is required' });

  const result = dbStore.toggleFavorite(req.user.id, contentId);
  res.json({ message: result.isFavorite ? 'Added to favorites' : 'Removed from favorites', ...result });
});

// DELETE /api/user/favorites/:id
router.delete('/user/favorites/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const contentId = req.params.id;
  const result = dbStore.toggleFavorite(req.user.id, contentId);
  res.json({ message: 'Favorite status updated', ...result });
});

// ================= WATCHLIST =================
// GET /api/user/watchlist
router.get('/user/watchlist', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = dbStore.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Enrich watchlist with content details
  const enriched = user.watchlist.map((w) => {
    const item = dbStore.getContentById(w.contentId);
    return {
      ...w,
      content: item || null,
    };
  });

  res.json({ count: enriched.length, data: enriched });
});

// POST /api/user/watchlist
router.post('/user/watchlist', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { contentId, contentType, status = 'Plan to Watch', progress } = req.body;

  if (!contentId || !contentType) {
    return res.status(400).json({ error: 'contentId and contentType are required' });
  }

  const updatedList = dbStore.setWatchlist(
    req.user.id,
    contentId,
    contentType as ContentType,
    status as WatchlistStatus,
    progress
  );

  res.json({ message: 'Watchlist updated', data: updatedList });
});

// DELETE /api/user/watchlist/:id
router.delete('/user/watchlist/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const updatedList = dbStore.removeFromWatchlist(req.user.id, req.params.id);
  res.json({ message: 'Removed from watchlist', data: updatedList });
});

// ================= RATINGS =================
// POST /api/ratings
router.post('/ratings', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { contentId, contentType, rating } = req.body;

  if (!contentId || !contentType || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'contentId, contentType and rating (1-5) are required' });
  }

  const record = dbStore.rateContent(req.user.id, contentId, contentType as ContentType, rating);
  const updatedStats = dbStore.getContentRatings(contentId);
  res.json({ message: 'Rating submitted', data: record, stats: updatedStats });
});

// GET /api/ratings/:contentId
router.get('/ratings/:contentId', (req, res) => {
  const stats = dbStore.getContentRatings(req.params.contentId);
  res.json({ data: stats });
});

// ================= MOOD HISTORY =================
// POST /api/mood
router.post('/mood', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { mood, situation, state, genres = [], contentType = 'All', language = 'English', recommendedIds = [] } = req.body;

  if (!mood || !situation || !state) {
    return res.status(400).json({ error: 'mood, situation, and state are required' });
  }

  const record = dbStore.addMoodHistory(req.user.id, {
    mood: mood as MoodType,
    situation: situation as SituationType,
    state: state as EnergyStateType,
    genres,
    contentType,
    language,
    recommendedIds,
  });

  res.status(201).json({ message: 'Mood recorded', data: record });
});

// GET /api/mood/history
router.get('/mood/history', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const history = dbStore.getMoodHistory(req.user.id);
  res.json({ count: history.length, data: history });
});

export default router;
