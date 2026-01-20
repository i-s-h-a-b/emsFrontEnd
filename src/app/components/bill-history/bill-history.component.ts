
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillHistoryService } from '../../services/common/bills/bill-history.service';

@Component({
  selector: 'app-bill-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-history.component.html',
  styleUrl: './bill-history.component.css'
})
export class BillHistoryComponent {

  fromDate = '';
  toDate = '';
  statusFilter = 'All';
  sortField = '';

  constructor(public historyService: BillHistoryService) {}

  get filteredBills() {
    let bills = [...this.historyService.bills];

    // Filter by payment status
    if (this.statusFilter !== 'All') {
      bills = bills.filter(b => b.paymentStatus === this.statusFilter);
    }

    // Filter by date range
    if (this.fromDate) {
      bills = bills.filter(b => b.billDate >= this.fromDate);
    }
    if (this.toDate) {
      bills = bills.filter(b => b.billDate <= this.toDate);
    }

    // Sorting
    if (this.sortField) {
      bills.sort((a: any, b: any) =>
        a[this.sortField] > b[this.sortField] ? 1 : -1
      );
    }

    return bills;
  }
}