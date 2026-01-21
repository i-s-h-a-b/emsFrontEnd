
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminSmeService,
  Sme,
  PageableResponse
} from '../../services/common/customerList/admin-sme-list.service';

@Component({
  selector: 'app-sme-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sme-list.component.html',
  styleUrls: ['./sme-list.component.css']
})
export class SmeListComponent implements OnInit {
  smes: Sme[] = [];
  loading = false;
  error: string | null = null;

  // Filter
  smeIdInput: string = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;

  // Expose Math to template
  Math = Math;

  constructor(@Inject(AdminSmeService) private smeService: AdminSmeService) {}

  ngOnInit(): void {
    this.loadSmes();
  }

  loadSmes(): void {
    this.loading = true;
    this.error = null;

    const smeId = this.smeIdInput ? Number(this.smeIdInput) : undefined;

    this.smeService.getSmes(smeId, this.currentPage, this.pageSize).subscribe({
      next: (response: PageableResponse<Sme>) => {
        this.smes = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load SMEs. Please ensure the backend is running.';
        console.error('Error loading SMEs:', err);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadSmes();
  }

  clearFilters(): void {
    this.smeIdInput = '';
    this.currentPage = 0;
    this.loadSmes();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadSmes();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadSmes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadSmes();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadSmes();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}