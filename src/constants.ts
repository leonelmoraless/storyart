
import { ArtStyle } from './types';

export const ART_STYLES: ArtStyle[] = [
  'anime',
  'realistic', 
  'cartoon',
  'pixel',
  'watercolor',
  'oil'
];

export const ART_STYLE_LABELS: Record<ArtStyle, string> = {
  'anime': 'Anime/Manga',
  'realistic': 'Realista',
  'cartoon': 'Cartoon',
  'pixel': 'Pixel Art',
  'watercolor': 'Acuarela',
  'oil': 'Óleo'
};
