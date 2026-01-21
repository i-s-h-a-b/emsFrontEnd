import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Page, ComplaintStatus, AdminComplaintDetailDTO } from '../complaintList/complaint-list.service';
import { ComplaintType } from '../complaintRegister/complaint-register.service';

export interface SmeSearchCriteria {
    page?: number;
    size?: number;
    complaintId?: number;
    assignedToUserId?: number;
    status?: ComplaintStatus;
    type?: ComplaintType;
    category?: string; // Enum in backend but string is fine here
    submittedFrom?: string; // ISO DateTime
    submittedTo?: string; // ISO DateTime
    q?: string;
    sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SmeComplaintListService {
   private readonly baseUrl = environment.apiBaseUrl;
    private apiUrl = `${this.baseUrl}api/complaints/sme`;

    constructor(private http: HttpClient) { }

    /**
     * List complaints for Admin with advanced fitlers.
     * Matches: GET /api/complaints/admin
     */
    getComplaints(criteria: SmeSearchCriteria): Observable<Page<AdminComplaintDetailDTO>> {
        let params = new HttpParams()
            .set('page', criteria.page ?? 0)
            .set('size', criteria.size ?? 20)
            .set('sort', criteria.sort ?? 'dateSubmitted,desc');

        if (criteria.complaintId) params = params.set('complaintId', criteria.complaintId);
        //if (criteria.assignedToUserId) params = params.set('assignedToUserId', criteria.assignedToUserId);
        if (criteria.status) params = params.set('status', criteria.status);
        if (criteria.type) params = params.set('type', criteria.type);
        if (criteria.category) params = params.set('category', criteria.category);
        if (criteria.submittedFrom) params = params.set('submittedFrom', criteria.submittedFrom);
        if (criteria.submittedTo) params = params.set('submittedTo', criteria.submittedTo);
        // if (criteria.q) params = params.set('q', criteria.q);

        return this.http.get<Page<AdminComplaintDetailDTO>>(this.apiUrl, { params });
    }

    getComplaintById(complaintId: number): Observable<AdminComplaintDetailDTO> {
        return this.http.get<AdminComplaintDetailDTO>(`${this.baseUrl}api/complaints/${complaintId}`);
    }

    
    updateComplaintStatus(complaintId: number, status: ComplaintStatus) {
        const url = `${this.baseUrl}api/complaints/${complaintId}/status`;
        // Backend you shared accepts body: { status: "OPEN" }
        return this.http.patch<AdminComplaintDetailDTO>(url, { status });
    }
 addNotesInComplaint(complaintId: number, note:String){
        const url = `${this.baseUrl}api/complaints/${complaintId}/notes`;
        // Backend you shared accepts body: { status: "OPEN" }
        return this.http.post<AdminComplaintDetailDTO>(url, { note });
    }

    
acceptComplaint(complaintId: number) {
  const url = `${this.baseUrl}api/complaints/${complaintId}/accept`;
  return this.http.post<AdminComplaintDetailDTO>(url, {});
}

}

