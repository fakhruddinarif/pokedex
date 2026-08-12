import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Pagination control. Max 7 buttons: [Prev][1..5][Next].
 * The current page button is always centered (disabled) — except on the first
 * two pages and the last two pages, where it sits naturally at an edge.
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly pageChange = output<number>();

  readonly window = computed<number[]>(() => {
    const total = this.total();
    const current = this.current();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 2) return [1, 2, 3, 4, 5];
    if (current >= total - 1) return [total - 4, total - 3, total - 2, total - 1, total];
    return [current - 2, current - 1, current, current + 1, current + 2];
  });

  readonly canPrev = computed(() => this.current() > 1);
  readonly canNext = computed(() => this.current() < this.total());

  go(page: number): void {
    if (page < 1 || page > this.total() || page === this.current()) return;
    this.pageChange.emit(page);
  }
  prev(): void { if (this.canPrev()) this.go(this.current() - 1); }
  next(): void { if (this.canNext()) this.go(this.current() + 1); }

  trackPage(p: number): number { return p; }
}