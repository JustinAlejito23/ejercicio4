import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaItemService } from './services/media-item.service';
import { FavoriteDirective } from './directives/favorite.directive';
import { CategoryListPipe } from './pipes/category-list.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FavoriteDirective, CategoryListPipe],
  template: `
    <div class="nordic-shell">
      <header class="hero-header">
        <div>
          <span class="tag">ESSENTIAL TRAINING // 04</span>
          <h1>Media Watch List</h1>
          <p class="cats">Categorías activas: <strong>{{ filteredItems() | categoryList }}</strong></p>
        </div>
        <div class="filter-pills">
          <button [class.active]="filter() === 'All'" (click)="filter.set('All')">Todos ({{ mediaService.items().length }})</button>
          <button [class.active]="filter() === 'Movies'" (click)="filter.set('Movies')">Películas</button>
          <button [class.active]="filter() === 'Series'" (click)="filter.set('Series')">Series</button>
        </div>
      </header>

      <section class="add-card">
        <input [(ngModel)]="name" placeholder="Título (ej. Blade Runner 2049)" />
        <select [(ngModel)]="medium">
          <option value="Movies">Película (Movie)</option>
          <option value="Series">Serie (Series)</option>
        </select>
        <select [(ngModel)]="category">
          <option value="Science Fiction">Science Fiction</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
        </select>
        <input type="number" [(ngModel)]="year" placeholder="Año" class="yr" />
        <button class="btn-add" (click)="addItem()">+ Agregar Título</button>
      </section>

      <section class="media-grid">
        <article class="media-card" *ngFor="let item of filteredItems()" [attr.data-medium]="item.medium">
          <div class="card-head">
            <span class="medium-badge">{{ item.medium }}</span>
            <button class="fav-btn" [mwFavorite]="item.isFavorite" (click)="mediaService.toggleFavorite(item.id)" title="Marcar favorito">★</button>
          </div>
          <h3>{{ item.name }}</h3>
          <div class="meta-row">
            <span>{{ item.category }}</span>
            <span>{{ item.year }}</span>
          </div>
          <div class="card-foot">
            <small>{{ item.watchedOn ? 'Visto el ' + item.watchedOn : 'Pendiente por ver' }}</small>
            <button class="del-btn" (click)="mediaService.delete(item.id)">Eliminar</button>
          </div>
        </article>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%); color: #1e1b4b; font-family: 'Segoe UI', system-ui, sans-serif; padding: 2rem 1rem; box-sizing: border-box; }
    .nordic-shell { max-width: 960px; margin: 0 auto; }
    .hero-header { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem; }
    .tag { background: #e0e7ff; color: #4338ca; font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 6px; letter-spacing: 1px; }
    h1 { margin: 0.4rem 0 0.25rem; font-size: 1.9rem; color: #1e1b4b; }
    .cats { margin: 0; font-size: 0.85rem; color: #4f46e5; }
    .filter-pills { display: flex; gap: 0.45rem; background: #fff; padding: 0.35rem; border-radius: 12px; border: 1px solid #c7d2fe; }
    .filter-pills button { border: none; background: transparent; color: #4338ca; font-weight: 700; padding: 0.5rem 1rem; border-radius: 9px; cursor: pointer; }
    .filter-pills button.active { background: #4f46e5; color: #fff; }
    .add-card { display: flex; gap: 0.65rem; flex-wrap: wrap; background: #fff; padding: 1rem; border-radius: 16px; border: 1px solid #c7d2fe; margin-bottom: 1.75rem; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.06); }
    input, select { padding: 0.65rem 0.9rem; border: 1px solid #c7d2fe; border-radius: 10px; font-size: 0.9rem; outline: none; color: #1e1b4b; background: #f8fafc; }
    input:first-child { flex: 2; min-width: 190px; }
    .yr { width: 90px; }
    .btn-add { background: #6366f1; color: #fff; border: none; padding: 0.65rem 1.25rem; border-radius: 10px; font-weight: 700; cursor: pointer; }
    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.15rem; }
    .media-card { background: #fff; border: 1px solid #e0e7ff; border-left: 5px solid #4f46e5; border-radius: 16px; padding: 1.25rem; box-shadow: 0 6px 16px rgba(30, 27, 75, 0.04); display: flex; flex-direction: column; justify-content: space-between; }
    .media-card[data-medium="Series"] { border-left-color: #9333ea; }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem; }
    .medium-badge { background: #eef2ff; color: #4338ca; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 999px; }
    .media-card[data-medium="Series"] .medium-badge { background: #f3e8ff; color: #7e22ce; }
    .fav-btn { background: transparent; border: none; font-size: 1.35rem; color: #cbd5e1; cursor: pointer; line-height: 1; }
    .fav-btn.is-favorite { color: #f59e0b; }
    h3 { margin: 0 0 0.5rem; font-size: 1.15rem; color: #1e1b4b; }
    .meta-row { display: flex; justify-content: space-between; font-size: 0.84rem; color: #64748b; margin-bottom: 1rem; }
    .card-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; }
    small { color: #6366f1; font-size: 0.78rem; }
    .del-btn { background: #fee2e2; color: #dc2626; border: none; padding: 0.3rem 0.65rem; border-radius: 7px; font-size: 0.78rem; font-weight: 700; cursor: pointer; }
  `]
})
export class App {
  mediaService = inject(MediaItemService);
  filter = signal<'All' | 'Movies' | 'Series'>('All');
  name = '';
  medium: 'Movies' | 'Series' = 'Movies';
  category = 'Science Fiction';
  year = 2026;

  filteredItems = computed(() => {
    const f = this.filter();
    const list = this.mediaService.items();
    return f === 'All' ? list : list.filter(i => i.medium === f);
  });

  addItem() {
    if (!this.name.trim()) return;
    this.mediaService.add({ name: this.name.trim(), medium: this.medium, category: this.category, year: Number(this.year) || 2026 });
    this.name = '';
  }
}
