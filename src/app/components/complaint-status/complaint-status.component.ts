import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComplaintListService, ComplaintStatus, Page, AdminComplaintDetailDTO } from '../../services/apis/complaintList/complaint-list.service';
import { ComplaintResponse, ComplaintType } from '../../services/apis/complaintRegister/complaint-register.service';

@Component({
  selector: 'app-complaint-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-status.component.html',
  styleUrls: ['./complaint-status.component.css']
})
export class ComplaintStatusComponent implements OnInit {

  // Filters
  searchId = '';
  searchStatus: ComplaintStatus | '' = '';
  searchType: ComplaintType | '' = '';
  pageSize = 10;
  availablePageSizes = [5, 10, 20, 50];

  // Data & State
  complaints = signal<ComplaintResponse[]>([]);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Detail View State
  selectedComplaint = signal<AdminComplaintDetailDTO | null>(null);
  isLoadingDetails = signal<boolean>(false);

  // Enum values for dropdowns
  statuses: ComplaintStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  types: ComplaintType[] = ['BILLING_ISSUE', 'POWER_OUTAGE', 'METER_FAULT', 'CONNECTION_REQUEST'];

  // Editing State
  editingComplaintId = signal<number | null>(null);
  editingDescription = signal<string>('');
  isSubmittingEdit = signal<boolean>(false);

  constructor(private complaintListService: ComplaintListService) { }

  ngOnInit(): void {
    // Load initial list
    this.fetchComplaints();
  }

  fetchComplaints(page: number = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const idParam = this.searchId ? Number(this.searchId) : undefined;
    const statusParam = this.searchStatus || undefined;
    const typeParam = this.searchType || undefined;

    this.complaintListService.getMyComplaints(page, this.pageSize, idParam, statusParam, typeParam)
      .subscribe({
        next: (pageData: Page<ComplaintResponse>) => {
          this.complaints.set(pageData.content);
          this.totalElements.set(pageData.totalElements);
          this.totalPages.set(pageData.totalPages);
          this.currentPage.set(pageData.number);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching complaints', err);
          this.isLoading.set(false);
          this.errorMessage.set('Failed to load complaints. Please try again.');
        }
      });
  }

  viewDetails(complaintId: number): void {
    this.isLoadingDetails.set(true);
    this.selectedComplaint.set(null); // Clear previous selection

    this.complaintListService.getComplaintById(complaintId).subscribe({
      next: (details) => {
        this.selectedComplaint.set(details);
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('Error fetching details', err);
        this.isLoadingDetails.set(false);
        alert('Failed to load complaint details.');
      }
    });
  }

  closeDetails(): void {
    this.selectedComplaint.set(null);
  }

  startEdit(complaint: ComplaintResponse): void {
    this.editingComplaintId.set(complaint.complaintId);
    this.editingDescription.set(complaint.description);
  }

  cancelEdit(): void {
    this.editingComplaintId.set(null);
    this.editingDescription.set('');
  }

  saveDescription(complaintId: number): void {
    const newDesc = this.editingDescription();
    if (!newDesc || newDesc.trim().length === 0) return;

    this.isSubmittingEdit.set(true);
    this.complaintListService.updateDescription(complaintId, newDesc).subscribe({
      next: () => {
        this.isSubmittingEdit.set(false);
        this.cancelEdit();
        // If the details modal is open and matching this ID, update it too
        const currentDetails = this.selectedComplaint();
        if (currentDetails && currentDetails.complaintId === complaintId) {
          this.viewDetails(complaintId); // Reload details
        }
        this.fetchComplaints(this.currentPage()); // Refresh list
      },
      error: (err) => {
        console.error('Error updating description', err);
        this.isSubmittingEdit.set(false);
        alert('Failed to update description');
      }
    });
  }

  onPageSizeChange(): void {
    this.fetchComplaints(0);
  }

  onSearch(): void {
    this.fetchComplaints(0);
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.fetchComplaints(newPage);
    }
  }

  resetFilters(): void {
    this.searchId = '';
    this.searchStatus = '';
    this.searchType = '';
    this.fetchComplaints(0);
  }
}
