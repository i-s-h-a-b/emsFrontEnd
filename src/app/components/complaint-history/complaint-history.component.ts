
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplaintService } from '../../services/common/complain/complaint.service';
import { Complaint,ContactMethod } from '../../model/complain';

@Component({
  selector: 'app-complaint-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complaint-history.component.html',
  styleUrls: ['./complaint-history.component.css']
})
export class ComplaintHistoryComponent implements OnInit {
  complaints: Complaint[] = [];
  selected: Complaint | null = null;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.complaints = this.complaintService.getComplaints();
  }

  select(c: Complaint): void {
    this.selected = c;
  }
}
