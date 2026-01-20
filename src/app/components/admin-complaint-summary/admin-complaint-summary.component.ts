
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComplaintService } from '../../services/common/complain/complaint.service';
import { Complaint, ComplaintStatus } from '../../model/complain';


type UiStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
function toUiStatus(s: ComplaintStatus): UiStatus {
  return s === 'Pending' ? 'Open' : (s as UiStatus);
}
function fromUiStatus(s: UiStatus): ComplaintStatus {
  return s === 'Open' ? 'Pending' : (s as ComplaintStatus);
}

@Component({
  selector: 'app-admin-complaint-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-complaint-summary.component.html',
  styleUrls: ['./admin-complaint-summary.component.css']
})
export class AdminComplaintSummaryComponent implements OnInit {
  complaint = signal<Complaint | null>(null);
  statuses: UiStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  newStatus: UiStatus = 'Open';
  notes = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    const found = this.complaintService.getComplaintById(id);
    if (!found) {
      alert('Complaint not found');
      this.router.navigate(['/admin/complaints']);
      return;
    }
    this.complaint.set(found);
    this.newStatus = toUiStatus(found.status);
    this.notes = found.adminNotes ?? '';
  }

  update(): void {
    const c = this.complaint();
    if (!c) return;
    const updated = this.complaintService.updateComplaintStatus(c.complaintId, fromUiStatus(this.newStatus), this.notes);
    if (updated) {
      alert(`Complaint ${updated.complaintId} updated successfully.`);
      this.complaint.set(updated);
    }
  }
}
``
