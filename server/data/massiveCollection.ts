import { ContentItem } from '../types.js';
import { MANGA_CATALOG } from './mangaCatalog.js';
import { MANHWA_CATALOG } from './manhwaCatalog.js';
import { MANHUA_CATALOG } from './manhuaCatalog.js';
import { DONGHUA_CATALOG } from './donghuaCatalog.js';

export const MASSIVE_COLLECTION: ContentItem[] = [
  ...MANGA_CATALOG,
  ...MANHWA_CATALOG,
  ...MANHUA_CATALOG,
  ...DONGHUA_CATALOG,
];
