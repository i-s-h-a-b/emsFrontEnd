
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ComplaintService } from '../../services/common/complain/complaint.service';
import { SearchCriteria } from '../../services/common/complain/complaint.service';
import { Complaint,ComplaintStatus } from '../../model/complain';

type UiStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

// Map Pending -> Open (UI only)
function toUiStatus(s: ComplaintStatus): UiStatus {
  return s === 'Pending' ? 'Open' : (s as UiStatus);
}
function fromUiStatus(s: UiStatus): ComplaintStatus {
  return s === 'Open' ? 'Pending' : (s as ComplaintStatus);
}

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.css']
})
export class AdminComplaintsComponent implements OnInit {
  // Declare first; initialize in constructor to avoid "fb used before initialization"
  searchForm!: FormGroup;

  complaints = signal<Complaint[]>([]);
  errorMessage = signal<string>('');

  // Inline status update state
  statuses: UiStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  editing: Record<string, { status: UiStatus; notes: string }> = {};

  constructor(
    private fb: NonNullableFormBuilder,  // <-- use NonNullable builder
    private router: Router,
    private complaintService: ComplaintService
  ) {
    // Initialize form here (fb is available)
    this.searchForm = this.fb.group({
      customerId: '',      // all controls are non-nullable strings
      consumerNumber: '',
      complaintId: '',
      complaintType: '',
      startDate: '',       // yyyy-MM-dd
      endDate: ''
    });
  }

  ngOnInit(): void {
    // Optionally show all on load
    this.complaints.set(this.complaintService.getComplaints());
  }

  /** Normalize form value to SearchCriteria (string | undefined) */
  private toCriteria(v: {
    customerId: string;
    consumerNumber: string;
    complaintId: string;
    complaintType: string;
    startDate: string;
    endDate: string;
  }): SearchCriteria {
    const trimOrUndef = (s: string) => (s && s.trim() ? s.trim() : undefined);

    return {
      customerId: trimOrUndef(v.customerId),
      consumerNumber: trimOrUndef(v.consumerNumber),
      complaintId: trimOrUndef(v.complaintId),
      complaintType: trimOrUndef(v.complaintType),
      startDate: v.startDate ? new Date(v.startDate).toISOString() : undefined,
      endDate: v.endDate ? new Date(v.endDate).toISOString() : undefined
    };
  }

  search(): void {
    this.errorMessage.set('');

    // Get raw form value (all strings), normalize to SearchCriteria
    const raw = this.searchForm.value as {
      customerId: string;
      consumerNumber: string;
      complaintId: string;
      complaintType: string;
      startDate: string;
      endDate: string;
    };
    const criteria = this.toCriteria(raw);

    const results = this.complaintService.searchComplaints(criteria);

    if (!results.length) {
      if (criteria.customerId || criteria.complaintId) {
        this.errorMessage.set('No matching Customer ID or Complaint ID found.');
      } else {
        this.errorMessage.set('No complaints match the search criteria.');
      }
    }
    this.complaints.set(results);

    // Initialize editing entries for each result
    this.editing = {};
    results.forEach(c => {
      this.editing[c.complaintId] = {
        status: toUiStatus(c.status),
        notes: c.adminNotes ?? ''
      };
    });
  }

  updateStatus(c: Complaint): void {
    const edit = this.editing[c.complaintId];
    if (!edit) return;

    const updated = this.complaintService.updateComplaintStatus(
      c.complaintId,
      fromUiStatus(edit.status),
      edit.notes
    );

    if (updated) {
      alert(`Status updated for complaint ${updated.complaintId}.`);

      // Refresh list using the current normalized criteria
      const raw = this.searchForm.value as {
        customerId: string; consumerNumber: string; complaintId: string;
        complaintType: string; startDate: string; endDate: string;
      };
      const criteria = this.toCriteria(raw);
      const list = this.complaintService.searchComplaints(criteria);
      this.complaints.set(list);
    }
  }

  exportCSV(): void {
    this.complaintService.exportComplaintsToCSV(this.complaints());
  }

  exportPDF(): void {
    // Uses browser print-to-PDF on the table element
    this.complaintService.exportTableToPDFByPrint('admin-table');
  }

  openSummary(c: Complaint): void {
    this.router.navigate(['/admin/complaints', c.complaintId]);
  }

  statusClass(uiStatus: UiStatus): string {
    switch (uiStatus) {
      case 'Open': return 'badge open';
      case 'In Progress': return 'badge progress';
      case 'Resolved': return 'badge resolved';
      case 'Closed': return 'badge closed';
    }
  }
}
