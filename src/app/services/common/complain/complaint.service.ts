import { Injectable } from '@angular/core';
import { Complaint,ComplaintStatus } from '../../../model/complain';

const STORAGE_KEY = 'ems_complaints';

export interface SearchCriteria {
  customerId?: string;
  consumerNumber?: string;
  complaintId?: string;
  complaintType?: string;
  startDate?: string; // ISO date string (inclusive)
  endDate?: string;   // ISO date string (inclusive)
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private complaints: Complaint[] = [
    
  ];

  constructor() {
    this.loadFromStorage();
  }

  /** ---- Storage helpers ---- */
  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.complaints));
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    this.complaints = raw ? (JSON.parse(raw) as Complaint[]) : [];
  }

  /** ---- Utility ---- */
  private generateId(): string {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CMP-${Date.now()}-${rand}`;
  }

  private withinRange(dateISO: string, startISO?: string, endISO?: string): boolean {
    const d = new Date(dateISO).getTime();
    const s = startISO ? new Date(startISO).getTime() : -Infinity;
    const e = endISO ? new Date(endISO).getTime() : Infinity;
    return d >= s && d <= e;
  }

  /** ---- API: getters/setters ---- */
  getComplaints(): Complaint[] {
    return [...this.complaints];
  }

  setComplaints(list: Complaint[]): void {
    this.complaints = [...list];
    this.saveToStorage();
  }

  addComplaint(partial: Omit<Complaint, 'complaintId' | 'submittedAt' | 'status' | 'lastUpdatedAt'>): Complaint {
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      ...partial,
      customerId: (100 + Math.floor(Math.random() * 900)).toString(),
      consumerNumber: (100 + Math.floor(Math.random() * 900)).toString(),
      complaintId: this.generateId(),
      submittedAt: now,
      status: 'Pending',
      lastUpdatedAt: now
    };
    this.complaints.unshift(newComplaint);
    this.saveToStorage();
    return newComplaint;
  }

  getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find(c => c.complaintId === id);
  }

  getComplaintsByStatus(status: ComplaintStatus): Complaint[] {
    return this.complaints.filter(c => c.status === status);
  }

  /** ---- Admin: search ---- */
  searchComplaints(criteria: SearchCriteria): Complaint[] {
    const {
      customerId,
      consumerNumber,
      complaintId,
      complaintType,
      startDate,
      endDate
    } = criteria;

    return this.getComplaints().filter(c => {
      const byCust = customerId ? (c.customerId?.toLowerCase() === customerId.toLowerCase()) : true;
      const byCons = consumerNumber ? (c.consumerNumber?.toLowerCase() === consumerNumber.toLowerCase()) : true;
      const byId = complaintId ? (c.complaintId.toLowerCase() === complaintId.toLowerCase()) : true;
      const byType = complaintType ? (c.complaintType.toLowerCase() === complaintType.toLowerCase()) : true;
      const byDate = this.withinRange(c.submittedAt, startDate, endDate);
      return byCust && byCons && byId && byType && byDate;
    });
  }

  /** ---- Admin: status update + notes ---- */
  updateComplaintStatus(id: string, status: ComplaintStatus, notes?: string): Complaint | undefined {
    const c = this.getComplaintById(id);
    if (c) {
      c.status = status;
      c.adminNotes = notes;
      c.lastUpdatedAt = new Date().toISOString();
      this.saveToStorage();
    }
    return c;
  }

  /** ---- Admin: exports ---- */
  exportComplaintsToCSV(list: Complaint[]): void {
    const headers = [
      'Complaint ID',
      'Customer ID',
      'Consumer Number',
      'Complaint Type',
      'Category',
      'Date Submitted',
      'Status',
      'Last Updated',
      'Contact Method',
      'Contact Email',
      'Contact Phone',
      'Admin Notes'
    ];

    const rows = list.map(c => [
      c.complaintId,
      c.customerId ?? '',
      c.consumerNumber ?? '',
      c.complaintType,
      c.category,
      c.submittedAt,
      c.status,
      c.lastUpdatedAt ?? '',
      c.contactMethod,
      c.contactEmail ?? '',
      c.contactPhone ?? '',
      c.adminNotes ?? ''
    ]);

    const csvContent = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Simple print-to-PDF using browser */
  exportTableToPDFByPrint(elementId: string): void {
    const elem = document.getElementById(elementId);
    if (!elem) return;
    const printWindow = window.open('', '', 'width=1024,height=768');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Complaints</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>${elem.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();   // User selects "Save as PDF"
    printWindow.close();
  }
}

