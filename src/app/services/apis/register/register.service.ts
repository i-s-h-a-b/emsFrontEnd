import { Injectable } from '@angular/core';
import { environment } from '../../../environment';

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    cousumerNumber: string; // matches backend DTO field name (note typo in backend)
    fname?: string;
    lname?: string;
    address?: string;
    mobileNumber?: string;
    electricalSection?: string; // 'OFFICE', 'REGION', 'EAST_ZONE', etc.
    customerType?: string;      // 'RESIDENTIAL', 'COMMERCIAL'
}

export interface UserResponse {
    userId?: number;
    customerID?: number;
    refinedCustomerId?: string;
    username?: string;
    email?: string;
    fname?: string;
    lname?: string;
    address?: string;
    mobileNumber?: string;
    electricalSection?: string;
    consumerNumber?: string;
    customerType?: string;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    private readonly baseUrl = environment.apiBaseUrl;

    constructor() { }

    /**
     * Registers a new user.
     * Endpoint: POST /api/auth/register
     */
    async register(body: RegisterRequest): Promise<UserResponse> {
        const url = `${this.baseUrl}api/auth/register`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            let message = `Registration failed (${res.status})`;
            try {
                const err = await res.json();
                // Backend often sends error message in 'message' field
                if (err && err.message) message = err.message;
            } catch { }
            throw new Error(message);
        }

        return (await res.json()) as UserResponse;
    }


    async checkUsernameTaken(username: string): Promise<boolean> {
        if (!username) return false;

        const url = `${this.baseUrl}api/auth/username-exist?username=${encodeURIComponent(username)}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to check username availability');
        }

        // The API returns true if user exists
        const exists = await res.json();
        return exists as boolean;
    }
}
