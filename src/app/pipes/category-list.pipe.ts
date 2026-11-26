import { Pipe, PipeTransform } from '@angular/core';
import { MediaItem } from '../models/media-item';

@Pipe({ name: 'categoryList', standalone: true })
export class CategoryListPipe implements PipeTransform {
  transform(items: MediaItem[]): string {
    const categories: string[] = [];
    items.forEach(item => {
      if (!categories.includes(item.category)) categories.push(item.category);
    });
    return categories.join(' • ');
  }
}
