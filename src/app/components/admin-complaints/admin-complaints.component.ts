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

  // Detail View State
  selectedComplaint = signal<AdminComplaintDetailDTO | null>(null);
  isLoadingDetails = signal<boolean>(false);
  statuses: ComplaintStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  
  isUpdatingStatus = signal<boolean>(false);
    statusDraft = signal<ComplaintStatus | null>(null)


  // Data State
  complaints = signal<AdminComplaintDetailDTO[]>([]);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  
  addNoteText = signal<string>('');
  isAddingNote = signal<boolean>(false);

  
assignedUserId = signal<number | null>(null);
isAssigning = signal<boolean>(false);

/**
 * Example dropdown source
 * Ideally fetched from API
 */
supportUsers = signal<{ id: number; name: string }[]>([
  { id: 1, name: 'Support User 1' },
  { id: 2, name: 'Support User 2' },
  { id: 3, name: 'Support User 3' }
]);


  // Pagination State
  pageSize = 5;
  availablePageSizes = [5, 10, 20, 50];
  // Enums for Dropdowns
  
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

  
addNote(): void {
  const complaint = this.selectedComplaint();
  const note = this.addNoteText()?.trim();

  if (!complaint || !note) return;

  this.isAddingNote.set(true);

  this.adminService
    .addNotesInComplaint(complaint.complaintId, note)
    .subscribe({
      next: (updatedComplaint) => {
        // Replace complaint with updated response (notes included)
        this.selectedComplaint.set(updatedComplaint);

        // Clear textarea
        this.addNoteText.set('');
        this.isAddingNote.set(false);
      },
      error: (err) => {
        console.error('Failed to add note', err);
        this.isAddingNote.set(false);
        alert('Failed to add note.');
      }
    });
  }


  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.search(newPage);
    }
  }
  onPageSizeChange(): void {
    this.search(0);
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.search(0);
  }

viewDetails(complaintId: number): void {
    this.isLoadingDetails.set(true);
    this.selectedComplaint.set(null);

    this.adminService.getComplaintById(complaintId).subscribe({
      next: (details) => {
        this.selectedComplaint.set(details);
        // Preselect current status in the dropdown
        this.assignedUserId.set(details.assignedToUserId ?? null);
        this.statusDraft.set(details.status);
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('Error fetching details', err);
        this.isLoadingDetails.set(false);
        alert('Failed to load complaint details.');
      }
    });
  }

  
assignComplaint(): void {
    const d = this.selectedComplaint();
    const userId = this.assignedUserId();
    if (!d || !userId) return;

    // No-op if already assigned to same user
    if (d.assignedToUserId === userId) return;

    this.isAssigning.set(true);

    this.adminService.assignComplaint(d.complaintId, userId).subscribe({
      next: (updated) => {
        this.selectedComplaint.set(updated);
        this.assignedUserId.set(updated.assignedToUserId ?? null);
        this.isAssigning.set(false);
      },
      error: (err) => {
        console.error('Assignment failed', err);
        this.isAssigning.set(false);
        alert('Assignment failed.');
      }
    });
  }

 


  updateStatus(): void {
    const d = this.selectedComplaint();
    const newStatus = this.statusDraft();

    if (!d || !newStatus || newStatus === d.status) return;

    this.isUpdatingStatus.set(true);

    this.adminService.updateComplaintStatus(d.complaintId, newStatus).subscribe({
      next: (updated) => {
        // Replace the selected complaint with the server response
        this.selectedComplaint.set(updated);
        // Keep dropdown in sync
        this.statusDraft.set(updated.status);
        this.isUpdatingStatus.set(false);
        // Optional: toast/snackbar
        // this.toastr.success('Status updated');
      },
      error: (err) => {
        console.error('Error updating status', err);
        this.isUpdatingStatus.set(false);
        alert('Failed to update status.');
      }
    });

    // this.onPageChange(this.currentPage());
  }

  
closeDetails(): void {
    this.selectedComplaint.set(null);
    this.statusDraft.set(null);
    this.assignedUserId.set(null);
    this.addNoteText.set('');
    this.isAddingNote.set(false);
    this.isUpdatingStatus.set(false);
    this.isAssigning.set(false);
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
