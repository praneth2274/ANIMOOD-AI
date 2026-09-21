import express from 'express';
import { dbStore } from '../db/store.js';
import { ContentType } from '../types.js';

const router = express.Router();

// Helper helper for specific categories
function registerCategoryRoutes(category: ContentType) {
  router.get(`/${category}/trending`, (req, res) => {
    const items = dbStore.getTrending(category);
    res.json({ count: items.length, data: items });
  });

  router.get(`/${category}/top`, (req, res) => {
    const items = dbStore.getTopRated(category);
    res.json({ count: items.length, data: items });
  });

  router.get(`/${category}/search`, (req, res) => {
    const query = (req.query.q as string) || '';
    const genre = req.query.genre as string;
    const status = req.query.status as string;
    const items = dbStore.searchContent(query, {
      contentType: category,
      genre,
      status,
    });
    res.json({ count: items.length, data: items });
  });

  router.get(`/${category}/:id`, (req, res) => {
    const item = dbStore.getContentById(req.params.id);
    if (!item || item.contentType !== category) {
      return res.status(404).json({ error: `${category} with id '${req.params.id}' not found` });
    }
    res.json({ data: item });
  });
}

registerCategoryRoutes('anime');
registerCategoryRoutes('manga');
registerCategoryRoutes('donghua');
registerCategoryRoutes('manhwa');
registerCategoryRoutes('manhua');

// Universal global search
router.get('/search', (req, res) => {
  const query = (req.query.q as string) || '';
  const contentType = (req.query.type as string) || 'all';
  const genre = (req.query.genre as string) || 'all';
  const status = (req.query.status as string) || 'all';
  const country = (req.query.country as string) || 'all';

  const items = dbStore.searchContent(query, {
    contentType,
    genre,
    status,
    country,
  });

  // Grouped results for rich search overview
  const grouped = {
    anime: items.filter((i) => i.contentType === 'anime'),
    manga: items.filter((i) => i.contentType === 'manga'),
    donghua: items.filter((i) => i.contentType === 'donghua'),
    manhwa: items.filter((i) => i.contentType === 'manhwa'),
    manhua: items.filter((i) => i.contentType === 'manhua'),
  };

  res.json({
    query,
    total: items.length,
    grouped,
    items,
  });
});

// Trending all
router.get('/trending', (req, res) => {
  const type = req.query.type as ContentType | undefined;
  const items = dbStore.getTrending(type);
  res.json({ count: items.length, data: items });
});

// Top rated all
router.get('/top-rated', (req, res) => {
  const type = req.query.type as ContentType | undefined;
  const items = dbStore.getTopRated(type);
  res.json({ count: items.length, data: items });
});

// Famous masterpieces & Hall of Fame
router.get('/famous', (req, res) => {
  const type = req.query.type as ContentType | undefined;
  const items = dbStore.getFamousMasterpieces(type);
  res.json({ count: items.length, data: items });
});

// Hidden gems
router.get('/hidden-gems', (req, res) => {
  const type = req.query.type as ContentType | undefined;
  const items = dbStore.getHiddenGems(type);
  res.json({ count: items.length, data: items });
});

// Universal content detail
router.get('/content/:id', (req, res) => {
  const item = dbStore.getContentById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: `Content with id '${req.params.id}' not found` });
  }
  const ratingInfo = dbStore.getContentRatings(item.contentId);
  res.json({ data: item, communityRating: ratingInfo });
});

// Cross-Media Recommendations (Section 19)
// If the user views Anime, recommend related Manga, Manhwa, Manhua, Donghua
router.get('/content/:id/cross-media', (req, res) => {
  const item = dbStore.getContentById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: `Content with id '${req.params.id}' not found` });
  }

  const allItems = dbStore.getAllContent();
  const currentType = item.contentType;

  // 1. Check direct relatedContent links first
  const explicitRelatedIds = (item.relatedContent || []).map((r) => r.id);
  const explicitMatches = allItems.filter((i) => explicitRelatedIds.includes(i.contentId));

  // 2. Cross-category matches by genre and tone
  const crossMediaTypes: ContentType[] = (['anime', 'manga', 'donghua', 'manhwa', 'manhua'] as ContentType[]).filter(
    (t) => t !== currentType
  );

  const crossCategoryPicks: Record<ContentType, any | null> = {
    anime: null,
    manga: null,
    donghua: null,
    manhwa: null,
    manhua: null,
  };

  for (const targetType of crossMediaTypes) {
    // Check if we have an explicit match
    const explicit = explicitMatches.find((m) => m.contentType === targetType);
    if (explicit) {
      crossCategoryPicks[targetType] = explicit;
    } else {
      // Find highest genre overlap in target category
      const candidates = allItems.filter((i) => i.contentType === targetType);
      const sorted = candidates.map((c) => {
        const overlap = c.genres.filter((g) => item.genres.includes(g)).length;
        return { item: c, score: overlap * 10 + c.rating };
      }).sort((a, b) => b.score - a.score);

      if (sorted.length > 0) {
        crossCategoryPicks[targetType] = sorted[0].item;
      }
    }
  }

  res.json({
    source: item,
    crossMedia: crossCategoryPicks,
  });
});

export default router;
