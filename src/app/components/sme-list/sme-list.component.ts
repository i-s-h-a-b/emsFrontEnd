import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSmeService, SmeListingResponse } from '../../services/apis/adminSmeList/admin-sme.service';

@Component({
  selector: 'app-list-sme',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sme-list.component.html',
  styleUrls: ['./sme-list.component.css']
})
export class ListSmeComponent implements OnInit {

  smes = signal<SmeListingResponse[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // pagination
  page = signal(0);
  size = 20;
  totalPages = signal(0);

  // filter
  smeId?: number;

  constructor(private adminSmeService: AdminSmeService) {}

  ngOnInit(): void {
    this.loadSmes();
  }

  loadSmes(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.adminSmeService.getSmes(
      this.page(),
      this.size,
      this.smeId
    ).subscribe({
      next: (res) => {
        this.smes.set(res.content);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load SMEs');
        this.loading.set(false);
      }
    });
  }

  search(): void {
    this.page.set(0);
    this.loadSmes();
  }

  next(): void {
    if (this.page() + 1 < this.totalPages()) {
      this.page.set(this.page() + 1);
      this.loadSmes();
    }
  }

  prev(): void {
    if (this.page() > 0) {
      this.page.set(this.page() - 1);
      this.loadSmes();
    }
  }
}
