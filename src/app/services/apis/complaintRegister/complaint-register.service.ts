import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

// Enums matching backend
export type ComplaintType = 'BILLING_ISSUE' | 'POWER_OUTAGE' | 'METER_FAULT' | 'CONNECTION_REQUEST';
export type PreferredContactMethod = 'EMAIL' | 'PHONE';

// Request DTO
export interface CreateComplaintRequest {
    complaintType: ComplaintType;
    description: string;
    contactEmail?: string;
    contactPhone?: string;
    assignedToUserId?: number;
    preferredContactMethod?: PreferredContactMethod;
}

// Response DTO
export interface ComplaintResponse {
    complaintId: number;
    complaintType: ComplaintType;
    category: string;
    description: string;
    preferredContactMethod?: PreferredContactMethod;
    contactEmail?: string;
    contactPhone?: string;
    status: string;
    dateSubmitted: string;
    lastUpdatedDate: string;
    customerId: number;
    refinedCustomerId: string;
    assignedToUserId?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ComplaintRegisterService {

    private readonly baseUrl = environment.apiBaseUrl;
    private apiUrl = `${this.baseUrl}api/complaints`;

    constructor(private http: HttpClient) { }

    createComplaint(request: CreateComplaintRequest): Observable<ComplaintResponse> {
        return this.http.post<ComplaintResponse>(this.apiUrl, request);
    }
}
