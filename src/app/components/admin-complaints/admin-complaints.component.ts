import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminComplaintService, AdminSearchCriteria } from '../../services/apis/adminComplaintList/admin-complaint.service';
import { ComplaintStatus, Page, AdminComplaintDetailDTO } from '../../services/apis/complaintList/complaint-list.service';
import { ComplaintType } from '../../services/apis/complaintRegister/complaint-register.service';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.css']
})
export class AdminComplaintsComponent implements OnInit {
  searchForm!: FormGroup;

  // Data State
  complaints = signal<AdminComplaintDetailDTO[]>([]);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Pagination State
  pageSize = 20;

  // Enums for Dropdowns
  statuses: ComplaintStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  types: ComplaintType[] = ['BILLING_ISSUE', 'POWER_OUTAGE', 'METER_FAULT', 'CONNECTION_REQUEST'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminComplaintService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      complaintId: [''],
      assignedToUserId: [''],
      status: [''],
      type: [''],
      category: [''],
      submittedFrom: [''],
      submittedTo: [''],
      q: ['']
    });

    // Load initial data
    this.search();
  }

  search(page: number = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const v = this.searchForm.value;

    const criteria: AdminSearchCriteria = {
      page: page,
      size: this.pageSize,
      complaintId: v.complaintId || undefined,
      assignedToUserId: v.assignedToUserId || undefined,
      status: v.status || undefined,
      type: v.type || undefined,
      category: v.category || undefined,
      submittedFrom: v.submittedFrom ? new Date(v.submittedFrom).toISOString() : undefined,
      submittedTo: v.submittedTo ? new Date(v.submittedTo).toISOString() : undefined,
      q: v.q || undefined,
      sort: 'dateSubmitted,desc'
    };

    this.adminService.getComplaints(criteria).subscribe({
      next: (pageData: Page<AdminComplaintDetailDTO>) => {
        this.complaints.set(pageData.content);
        this.totalElements.set(pageData.totalElements);
        this.totalPages.set(pageData.totalPages);
        this.currentPage.set(pageData.number);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Admin search failed', err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load complaints.');
      }
    });
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.search(newPage);
    }
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.search(0);
  }

  viewDetails(id: number): void {
    // You might want to implement a similar view/edit modal here as well
    // For now, let's just log it or navigate if you have a detail page
    console.log('View details', id);
    // this.router.navigate(['/admin/complaints', id]); 
  }

  exportCSV(): void {
    // Implement or call service logic
    alert('Export CSV not implemented yet');
  }

  exportPDF(): void {
    // Implement or call service logic
    alert('Export PDF not implemented yet');
  }
}
