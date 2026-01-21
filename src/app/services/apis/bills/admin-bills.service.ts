import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

/**
 * Connection type enum
 */
export type ConnectionType = 'DOMESTIC' | 'COMMERCIAL';

/**
 * Connection status enum
 */
export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED';

/**
 * Request payload for creating a bill
 * Matches the backend BillCreateRequest DTO
 */
export interface CreateBillRequest {
    billingPeriod: string;              // Format: 'YYYY-MM' (e.g., '2025-01')
    billDate: string;                   // ISO date string (e.g., '2025-01-15')
    dueDate: string;                    // ISO date string (e.g., '2025-01-30')
    billAmount: number;                 // Total bill amount
    lateFee: number;                    // Late fee amount (default: 0)
    connectionType: ConnectionType;     // 'DOMESTIC' or 'COMMERCIAL'
    connectionStatus: ConnectionStatus; // 'CONNECTED' or 'DISCONNECTED'
}

/**
 * Response DTO for a bill
 * Matches the backend BillDTO
 */
export interface BillDTO {
    billId: number;
    customerId: number;
    billingPeriod: string;      // YYYY-MM
    billDate: string;           // ISO date
    dueDate: string;            // ISO date
    billAmount: number;
    lateFee: number | null;
    dueAmount: number;
    paymentStatus: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PARTIALLY_PAID' | string;
    paymentDate?: string | null;
    connectionType?: string | null;
    connectionStatus?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AdminBillsService {

    private readonly baseUrl = environment.apiBaseUrl;
    private readonly http = inject(HttpClient);

    constructor() { }

    /**
     * Creates a new bill for a specific customer.
     * Endpoint: POST /api/admin/customers/{customerId}/bills
     * Authorization: Requires ADMIN role (handled by Interceptor)
     * 
     * @param customerId - The ID of the customer for whom the bill is being created
     * @param billData - The bill creation request payload
     * @returns Promise<BillDTO> - The created bill details
     */
    async createBill(customerId: number, billData: CreateBillRequest): Promise<BillDTO> {
        const url = `${this.baseUrl}api/admin/customers/${customerId}/bills`;
        // Convert the Observable to a Promise for easier async/await usage
        return firstValueFrom(this.http.post<BillDTO>(url, billData));
    }

    // /**
    //  * Optional: Get all bills for a specific customer (if backend supports it)
    //  * Endpoint: GET /api/admin/customers/{customerId}/bills
    //  * 
    //  * @param customerId - The ID of the customer
    //  * @returns Promise<BillDTO[]> - List of bills for the customer
    //  */
    // async getCustomerBills(customerId: number): Promise<BillDTO[]> {
    //     const url = `${this.baseUrl}api/admin/customers/${customerId}/bills`;
    //     return firstValueFrom(this.http.get<BillDTO[]>(url));
    // }

    // /**
    //  * Optional: Update a bill (if backend supports it)
    //  * Endpoint: PUT /api/admin/customers/{customerId}/bills/{billId}
    //  * 
    //  * @param customerId - The ID of the customer
    //  * @param billId - The ID of the bill to update
    //  * @param billData - The updated bill data
    //  * @returns Promise<BillDTO> - The updated bill details
    //  */
    // async updateBill(customerId: number, billId: number, billData: Partial<CreateBillRequest>): Promise<BillDTO> {
    //     const url = `${this.baseUrl}api/admin/customers/${customerId}/bills/${billId}`;
    //     return firstValueFrom(this.http.put<BillDTO>(url, billData));
    // }

    // /**
    //  * Optional: Delete a bill (if backend supports it)
    //  * Endpoint: DELETE /api/admin/customers/{customerId}/bills/{billId}
    //  * 
    //  * @param customerId - The ID of the customer
    //  * @param billId - The ID of the bill to delete
    //  * @returns Promise<void>
    //  */
    // async deleteBill(customerId: number, billId: number): Promise<void> {
    //     const url = `${this.baseUrl}api/admin/customers/${customerId}/bills/${billId}`;
    //     return firstValueFrom(this.http.delete<void>(url));
    // }
}
