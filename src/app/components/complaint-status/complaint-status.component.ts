
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComplaintService } from '../../services/common/complain/complaint.service';
import { Complaint,ContactMethod, ComplaintStatus } from '../../model/complain';

@Component({
  selector: 'app-complaint-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-status.component.html',
  styleUrls: ['./complaint-status.component.css']
})
export class ComplaintStatusComponent {
  searchId = '';
  searchStatus: ComplaintStatus | '' = '';
  resultById?: Complaint;
  resultByStatus: Complaint[] = [];
  statuses: ComplaintStatus[] = ['Pending', 'In Progress', 'Resolved', 'Closed'];

  constructor(private complaintService: ComplaintService) {}

  search(): void {
    this.resultById = undefined;
    this.resultByStatus = [];

    if (this.searchId.trim()) {
      this.resultById = this.complaintService.getComplaintById(this.searchId.trim());
    } else if (this.searchStatus) {
      this.resultByStatus = this.complaintService.getComplaintsByStatus(this.searchStatus);
    }
  }
}
