import { Injectable } from '@angular/core';
import { SmeComplaint,SmeComplaintStatus } from '../../../model/SmeCompain';


const STORAGE_KEY = 'ems_sme_complaints';


@Injectable({
  providedIn: 'root'
})
export class SmeComplaintService {

  private complaints: SmeComplaint[] = [];

  constructor() {
    this.loadFromStorage();

    // Seed some dummy data on first run (optional)
    if (this.complaints.length === 0) {
      this.complaints = [
        { complaintId: 'C101', customerId: 'CU001', complaintType: 'Billing Issue',        dateSubmitted: '2026-01-01', status: 'Open',        lastUpdated: '2026-01-02', notes: '' },
        { complaintId: 'C102', customerId: 'CU002', complaintType: 'Meter Reading Issue', dateSubmitted: '2026-01-03', status: 'In Progress', lastUpdated: '2026-01-04', notes: 'Technician assigned' },
        { complaintId: 'C103', customerId: 'CU003', complaintType: 'Power Outage',                dateSubmitted: '2026-01-05', status: 'Resolved',    lastUpdated: '2026-01-06', notes: 'Issue fixed' },
      ];
      this.saveToStorage();
    }
  }

  /** ---- Storage helpers ---- */
  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.complaints));
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    this.complaints = raw ? JSON.parse(raw) : [];
  }

  /** ---- Utility ---- */
  private generateId(): string {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CMP-${Date.now()}-${rand}`;
  }

  /** ---- API: getters/setters ---- */
  /** Returns a shallow copy to avoid external mutations */
  getComplaints(): SmeComplaint[] {
    return [...this.complaints];
  }

  /** Replace entire list (e.g., after syncing with backend) */
  setComplaints(list: SmeComplaint[]): void {
    this.complaints = [...list];
    this.saveToStorage();
  }

  /** Add a new complaint (UI-only for now) */
  addComplaint(partial: Omit<SmeComplaint, 'complaintId' | 'dateSubmitted' | 'status' | 'lastUpdated'>): SmeComplaint {
    const today = new Date().toISOString().slice(0, 10);

    const newComplaint: SmeComplaint = {
      ...partial,
      complaintId: this.generateId(),
      dateSubmitted: today,
      status: 'Open',
      lastUpdated: today,
      notes: partial.notes ?? ''
    };

    this.complaints.unshift(newComplaint);
    this.saveToStorage();
    return newComplaint;
  }

  /** Find by ID */
  getComplaintById(id: string): SmeComplaint | undefined {
    return this.complaints.find(c => c.complaintId === id);
  }

  /** Filter by status */
  getComplaintsByStatus(status: SmeComplaintStatus): SmeComplaint[] {
    return this.complaints.filter(c => c.status === status);
  }

  /** Filter by customer/consumer number */
  getComplaintsByCustomer(customerId: string): SmeComplaint[] {
    return this.complaints.filter(c => c.customerId === customerId);
  }

  /** Update status and optionally notes */
  updateComplaintStatus(id: string, status: SmeComplaintStatus, notes?: string): SmeComplaint | undefined {
    const c = this.getComplaintById(id);
    if (c) {
      c.status = status;
      if (typeof notes === 'string') {
        c.notes = notes;
      }
      c.lastUpdated = new Date().toISOString().slice(0, 10);
      this.saveToStorage();
    }
    return c;
  }

  /** Update notes only */
  updateComplaintNotes(id: string, notes: string): SmeComplaint | undefined {
    const c = this.getComplaintById(id);
    if (c) {
      c.notes = notes;
      c.lastUpdated = new Date().toISOString().slice(0, 10);
      this.saveToStorage();
    }
    return c;
  }

  /** Clear all (useful for testing) */
  clearAll(): void {
    this.complaints = [];
    this.saveToStorage();
  }
}