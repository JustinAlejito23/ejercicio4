import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[mwFavorite]', standalone: true })
export class FavoriteDirective {
  @HostBinding('class.is-favorite') isFavorite = false;
  @Input() set mwFavorite(val: boolean) { this.isFavorite = val; }
}
