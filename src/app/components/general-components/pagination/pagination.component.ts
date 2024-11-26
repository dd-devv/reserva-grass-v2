import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getVisiblePageNumbers(): number[] {
    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    if (this.totalPages <= maxVisiblePages) {
      return this.getPageNumbers();
    } else if (this.currentPage <= halfMaxVisiblePages) {
      return this.getPageNumbers().slice(0, maxVisiblePages);
    } else if (this.currentPage > this.totalPages - halfMaxVisiblePages) {
      return this.getPageNumbers().slice(-maxVisiblePages);
    } else {
      return [
        1,
        ...(this.getPageNumbers().slice(this.currentPage - halfMaxVisiblePages - 1, this.currentPage + halfMaxVisiblePages)),
        this.totalPages
      ];
    }
  }
}