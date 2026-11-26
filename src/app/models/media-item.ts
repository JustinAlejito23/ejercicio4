export interface MediaItem {
  id: number;
  name: string;
  medium: 'Movies' | 'Series';
  category: string;
  year: number;
  watchedOn: string | null;
  isFavorite: boolean;
}
