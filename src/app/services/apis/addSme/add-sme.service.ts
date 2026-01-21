import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface SmeCreateRequest {
    fname: string;
    lname: string;
    mobileNumber: string;
    userEmail: string;
    password: string;
    username: string;
}

export interface SmeResponse {
    employeeId: number;
    fname: string;
    lname: string;
    mobileNumber: string;
    userId: number;
    userEmail: string;
}

@Injectable({
    providedIn: 'root'
})
export class AddSmeService {

    private readonly baseUrl = environment.apiBaseUrl;
    private readonly http = inject(HttpClient);

    constructor() { }

    /**
     * Creates a new SME (Subject Matter Expert).
     * Endpoint: POST /api/admin/addsme
     * Authorization: Handled by Interceptor
     */
    async createSme(body: SmeCreateRequest): Promise<SmeResponse> {
        const url = `${this.baseUrl}api/admin/addsme`;
        // Convert the Observable to a Promise
        return firstValueFrom(this.http.post<SmeResponse>(url, body));
    }
}
