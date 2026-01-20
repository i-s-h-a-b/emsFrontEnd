
export type SmeComplaintStatus = 'Open' | 'In Progress' | 'Resolved';

export interface SmeComplaint {
  complaintId: string;
  customerId: string;            
  complaintType: 'Billing Issue' | 'Power Outage' | 'Meter Reading Issue';
  dateSubmitted: string;        
  status: SmeComplaintStatus;
  lastUpdated: string;          
  notes?: string;
}
