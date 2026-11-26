import { Injectable, signal } from '@angular/core';
import { MediaItem } from '../models/media-item';

@Injectable({ providedIn: 'root' })
export class MediaItemService {
  items = signal<MediaItem[]>([
    { id: 1, name: 'Firebug', medium: 'Series', category: 'Science Fiction', year: 2010, watchedOn: '2026-03-14', isFavorite: false },
    { id: 2, name: 'The Small Tall', medium: 'Movies', category: 'Comedy', year: 2015, watchedOn: null, isFavorite: true },
    { id: 3, name: 'The Redemption', medium: 'Movies', category: 'Action', year: 2016, watchedOn: null, isFavorite: false },
    { id: 4, name: 'Hoopers', medium: 'Series', category: 'Drama', year: 2018, watchedOn: null, isFavorite: true },
    { id: 5, name: 'Happy Joe: Cheery Road', medium: 'Movies', category: 'Action', year: 2015, watchedOn: '2026-08-22', isFavorite: false }
  ]);

  add(item: Omit<MediaItem, 'id' | 'watchedOn' | 'isFavorite'>) {
    const nextId = this.items().length ? Math.max(...this.items().map(i => i.id)) + 1 : 1;
    this.items.update(list => [{ id: nextId, ...item, watchedOn: null, isFavorite: false }, ...list]);
  }

  delete(id: number) {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  toggleFavorite(id: number) {
    this.items.update(list => list.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  }
}
