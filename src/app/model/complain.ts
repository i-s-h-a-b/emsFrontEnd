export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Open';
export type ContactMethod = 'email' | 'phone';


export interface Complaint {
  complaintId: string;        // Unique complaint ID
  complaintType: string;      // e.g., Billing Issue, Power Outage, Meter Reading Issue
  category: string;           // Depends on type
  description: string;        // Required, char limit
  contactMethod: ContactMethod;
  contactEmail?: string;      // If contactMethod = email
  contactPhone?: string;      // If contactMethod = phone
  submittedAt: string;        // ISO date-time
  status: ComplaintStatus;    // Pending by default


  /** ---- Admin-only optional fields ---- */
  customerId?: string;        // or consumer number, one or both
  consumerNumber?: string;
  lastUpdatedAt?: string;     // update whenever status changes
  adminNotes?: string;        // notes added during status updates


  dateSubmitted?:string;
  lastUpdated?:string ;
  notes?:string;
 
}
