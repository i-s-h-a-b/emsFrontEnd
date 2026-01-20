import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { ComplaintType, ComplaintResponse } from '../complaintRegister/complaint-register.service';

export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// DTO for detailed view
export interface AdminComplaintDetailDTO {
    complaintId: number;
    customerId: number;
    customerName?: string;
    complaintType: ComplaintType;
    category?: string;
    status: ComplaintStatus;
    description: string;
    preferredContactMethod?: string;
    contactEmail?: string;
    contactPhone?: string;
    dateSubmitted: string;
    lastUpdatedDate: string;
    assignedToUserId?: number;
    assignedToUserName?: string;
    notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ComplaintListService {

    private readonly baseUrl = environment.apiBaseUrl;
    private apiUrl = `${this.baseUrl}api/complaints`;

    constructor(private http: HttpClient) { }

    /**
     * List complaints for the logged-in customer.
     * Matches: GET /api/complaints
     */
    getMyComplaints(
        page: number = 0,
        size: number = 10,
        complaintId?: number,
        status?: ComplaintStatus,
        type?: ComplaintType
    ): Observable<Page<ComplaintResponse>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sort', 'lastUpdatedDate,desc'); // Default sort from backend

        if (complaintId) params = params.set('complaintId', complaintId);
        if (status) params = params.set('status', status);
        if (type) params = params.set('type', type);

        return this.http.get<Page<ComplaintResponse>>(this.apiUrl, { params });
    }

    /**
     * Get complaint details by ID.
     * Matches: GET /api/complaints/{complaintId}
     */
    getComplaintById(complaintId: number): Observable<AdminComplaintDetailDTO> {
        return this.http.get<AdminComplaintDetailDTO>(`${this.apiUrl}/${complaintId}`);
    }

    /**
     * Update description of a complaint.
     * Matches: PATCH /api/complaints/{complaintId}/description
     */
    updateDescription(complaintId: number, description: string): Observable<any> {
        const url = `${this.apiUrl}/${complaintId}/description`;
        return this.http.patch(url, { description });
    }
}
