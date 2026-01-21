
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BillsService,
  BillViewModel,
  BillListFilters,
  Page,
  BillDTO,
} from '../../services/apis/bills/bills-list.service';

@Component({
  selector: 'app-customer-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-bills.component.html',
  styleUrls: ['./view-bills.component.css'],
})
export class ViewBillsComponent implements OnInit {
  // ---- Filters (similar to complaint) ----
  searchId = '';                    // billId
  searchBillingPeriod = '';         // e.g. '2025-12'
  searchPaymentStatus: string = ''; // e.g. 'PAID' | 'UNPAID' (depends on your enum)
  dueDateFrom = '';                 // YYYY-MM-DD
  dueDateTo = '';                   // YYYY-MM-DD

  // ---- Pagination ----
  pageSize = 10;
  availablePageSizes = [5, 10, 20, 50];

  // ---- State ----
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(public billsService: BillsService) {}

  ngOnInit(): void {
    this.fetchBills();
  }

  // ---- Core data loading ----
  fetchBills(page: number = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const filters: BillListFilters = {
      billId: this.searchId ? Number(this.searchId) : undefined,
      billingPeriod: this.searchBillingPeriod || undefined,
      paymentStatus: this.searchPaymentStatus || undefined,
      dueDateFrom: this.dueDateFrom || undefined,
      dueDateTo: this.dueDateTo || undefined,
    };

    this.billsService
      .refreshBillsList(page, this.pageSize, filters)
      .subscribe({
        next: (pageData: Page<BillDTO>) => {
          this.totalElements.set(pageData.totalElements);
          this.totalPages.set(pageData.totalPages);
          this.currentPage.set(pageData.number);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching bills', err);
          this.isLoading.set(false);
          this.errorMessage.set('Failed to load bills. Please try again.');
        },
      });
  }

  // ---- Actions ----
  payBill(bill: BillViewModel): void {
    // Typically the amount is dueAmount; adjust if your payment flow differs.
    const amount = bill.dueAmount ?? 0;
    if (!bill.billNumber || amount <= 0) {
      alert('Invalid bill or amount.');
      return;
    }

    // Minimal payload; extend with method/ref/details as needed.
    this.isLoading.set(true);
    this.billsService
      .createPayment({
        billId: bill.billNumber,
        amount,
        paymentMethod: 'UPI',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          // refresh current page after successful payment
          this.fetchBills(this.currentPage());
        },
        error: (err) => {
          console.error('Payment failed', err);
          this.isLoading.set(false);
          alert('Payment failed. Please try again.');
        },
      });
  }

  // ---- Pagination / filters handlers ----
  onPageSizeChange(): void {
    this.fetchBills(0);
  }

  onSearch(): void {
    this.fetchBills(0);
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.fetchBills(newPage);
    }
  }

  resetFilters(): void {
    this.searchId = '';
    this.searchBillingPeriod = '';
    this.searchPaymentStatus = '';
    this.dueDateFrom = '';
    this.dueDateTo = '';
    this.fetchBills(0);
  }
}
