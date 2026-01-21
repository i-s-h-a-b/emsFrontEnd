
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment';

// ---- Shared pagination type ----
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

// ---- Backend DTO (mirrors your Java BillDTO) ----
export type PaymentStatus =
  | 'PAID'
  | 'UNPAID'
  | 'OVERDUE'
  | 'PARTIALLY_PAID'
  | string; // keep string fallback to be safe

export interface BillDTO {
  billId: number;
  customerId: number;

  billingPeriod: string; // YYYY-MM
  billDate: string;      // ISO date
  dueDate: string;       // ISO date

  billAmount: number;
  lateFee: number | null;
  dueAmount: number;

  paymentStatus: PaymentStatus;
  paymentDate?: string | null;

  connectionType?: string | null;
  connectionStatus?: string | null;
}

// ---- Frontend view model used by your existing template ----
export interface BillViewModel {
  billNumber: number;     // maps to billId
  consumerNo: number;     // maps to customerId
  billPeriod: string;     // maps to billingPeriod
  dueDate: string;        // maps to dueDate (ISO or formatted)
  paymentStatus: string;  // 'Paid' | 'Unpaid' | 'Overdue' | 'Partial' | backend string
  dueAmount: number;      // maps to dueAmount
}

// ---- Filters expected by backend @ModelAttribute BillListForCustomer ----
// If your backend uses different names, adjust the keys below.
export interface BillListFilters {
  billId?: number;
  billingPeriod?: string;      // e.g. '2025-12'
  paymentStatus?: PaymentStatus | string;
  dueDateFrom?: string;        // 'YYYY-MM-DD'
  dueDateTo?: string;          // 'YYYY-MM-DD'
}

export interface PaymentCreateRequest {
  billId: number;
  amount: number;
  paymentMethod?: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' | string;
  transactionRef?: string;
  notes?: string;
}

export interface PaymentResponse {
  paymentId?: number;
  billId: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | string;
  amount: number;
  paidOn?: string;
  providerRef?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class BillsService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly apiUrl = `${this.baseUrl}api/bills`;

  /**
   * This array is used by your existing template:
   *   *ngFor="let bill of billsService.bills"
   */
  public bills: BillViewModel[] = [];

  constructor(private http: HttpClient) {}

  /**
   * GET /api/bills/customer/me/bills
   * Paginates + filters bills for the logged-in customer.
   */
  getMyBills(
    page: number = 0,
    size: number = 10,
    filters: BillListFilters = {}
  ): Observable<Page<BillDTO>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'dueDate,desc'); // default sort from controller

    // Attach filters only if provided
    if (filters.billId != null) params = params.set('billId', filters.billId);
    if (filters.billingPeriod) params = params.set('billingPeriod', filters.billingPeriod);
    if (filters.paymentStatus) params = params.set('paymentStatus', String(filters.paymentStatus));
    if (filters.dueDateFrom) params = params.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) params = params.set('dueDateTo', filters.dueDateTo);

    return this.http.get<Page<BillDTO>>(`${this.apiUrl}/customer/me/bills`, { params });
  }

  /**
   * Convenience method to pull + map into ViewModel the array your template uses.
   */
  refreshBillsList(
    page: number = 0,
    size: number = 10,
    filters: BillListFilters = {}
  ): Observable<Page<BillDTO>> {
    return this.getMyBills(page, size, filters).pipe(
      tap((p) => {
        this.bills = p.content.map(this.toViewModel);
      })
    );
  }

  /**
   * POST /api/bills/payment
   */
  createPayment(payload: PaymentCreateRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment`, payload);
  }

  // ---------- Helpers ----------

  private toViewModel = (b: BillDTO): BillViewModel => ({
    billNumber: b.billId,
    consumerNo: b.customerId,
    billPeriod: b.billingPeriod,
    dueDate: b.dueDate,
    paymentStatus: this.formatPaymentStatus(b.paymentStatus),
    dueAmount: b.dueAmount
  });

  private formatPaymentStatus(status: PaymentStatus): string {
    const s = String(status || '').toUpperCase();
    if (s === 'PAID') return 'Paid';
    if (s === 'UNPAID') return 'Unpaid';
    if (s === 'OVERDUE') return 'Overdue';
    if (s === 'PARTIALLY_PAID') return 'Partial';
    return String(status || '');
  }
}
