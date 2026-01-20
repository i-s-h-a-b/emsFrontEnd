import { Component, inject } from '@angular/core';
import { SmeComplaint,SmeComplaintStatus } from '../../model/SmeCompain';
import { SmeComplaintService } from '../../services/common/smeComplain/sme-complaint.service';
import { signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


type SearchCriteria = {
  customerId: string;
  complaintId: string;
  complaintType: '' | SmeComplaint['complaintType'];
  dateFrom: string;
  dateTo: string;
};



@Component({
  selector: 'app-sme-complaints',
  imports: [CommonModule, FormsModule],
  templateUrl: './sme-complaints.component.html',
  styleUrl: './sme-complaints.component.css'
})
export class SmeComplaintsComponent {
  complaintTypes: SmeComplaint['complaintType'][] = [
    'Billing Issue',
    'Power Outage',
    'Meter Reading Issue'
  ];

  // ✅ Initialize empty; populate in constructor (prevents TS2729)
  complaints = signal<SmeComplaint[]>([]);

  search = signal<SearchCriteria>({
    customerId: '',
    complaintId: '',
    complaintType: '',
    dateFrom: '',
    dateTo: ''
  });
 title = 'Complaint Portal';
  // Inline edit
  editingId = signal<string | null>(null);
  editStatus = signal<SmeComplaintStatus>('Open');
  editNotes  = signal<string>('');

  constructor(private service: SmeComplaintService) {
    // ✅ Safe to use injected service here
    this.complaints.set(this.service.getComplaints());
  }

  // Computed filtered list
  filteredComplaints = computed(() => {
    const s = this.search();
    const from = s.dateFrom ? new Date(s.dateFrom).getTime() : Number.NEGATIVE_INFINITY;
    const to   = s.dateTo   ? new Date(s.dateTo).getTime()   : Number.POSITIVE_INFINITY;

    return this.complaints().filter(c => {
      const submitted = new Date(c.dateSubmitted).getTime();
      return (!s.customerId || c.customerId.toLowerCase().includes(s.customerId.toLowerCase())) &&
             (!s.complaintId || c.complaintId.toLowerCase().includes(s.complaintId.toLowerCase())) &&
             (!s.complaintType || c.complaintType === s.complaintType) &&
             (submitted >= from && submitted <= to);
    });
  });

  // UI helpers
  setSearch<K extends keyof SearchCriteria>(key: K, value: SearchCriteria[K]) {
    const current = this.search();
    this.search.set({ ...current, [key]: value });
  }

  clearSearch() {
    this.search.set({
      customerId: '',
      complaintId: '',
      complaintType: '',
      dateFrom: '',
      dateTo: ''
    });
  }

  statusClass(status: SmeComplaintStatus): string {
    switch (status) {
      case 'Open': return 'badge badge-open';
      case 'In Progress': return 'badge badge-progress';
      case 'Resolved': return 'badge badge-resolved';
      default: return 'badge';
    }
  }

  // Edit flow
  startEdit(c: SmeComplaint) {
    this.editingId.set(c.complaintId);
    this.editStatus.set(c.status);
    this.editNotes.set(c.notes ?? '');
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editStatus.set('Open');
    this.editNotes.set('');
  }

  saveEdit() {
    const id = this.editingId();
    if (!id) return;

    // Update via service
    this.service.updateComplaintStatus(id, this.editStatus(), this.editNotes());

    // Refresh signal from service
    this.complaints.set(this.service.getComplaints());

    this.cancelEdit();
    alert('Complaint status updated successfully.');
  }

  // Exports
  exportCSV() {
    const rows = [
      ['Complaint ID', 'Customer ID', 'Complaint Type', 'Date Submitted', 'Status', 'Last Updated', 'Notes'],
      ...this.filteredComplaints().map(c => [
        c.complaintId, c.customerId, c.complaintType, c.dateSubmitted, c.status, c.lastUpdated, (c.notes ?? '')
      ])
    ];

    const csv = rows.map(r =>
      r.map(cell => {
        const s = String(cell ?? '');
        const needsQuotes = /[,"\n]/.test(s);
        const escaped = s.replace(/"/g, '""');
        return needsQuotes ? `"${escaped}"` : escaped;
      }).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportPDF() {
    window.print();
  }
}

