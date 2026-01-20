// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminViewBillService } from '../../services/admin-view-bill.service';

// @Component({
//   selector: 'app-admin-view-bill',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './admin-view-bill.component.html',
//   styleUrl: './admin-view-bill.component.css'
// })
// export class AdminViewBillComponent {

//   consumerNo = '';
//   error = '';
//   selectedBill: any = null;

//   periodFilter = 'All';
//   statusFilter = 'All';

//   bills: any[] = [];

//   constructor(public service: AdminViewBillService) {}

//   search() {
//     this.error = '';
//     this.selectedBill = null;

//     if (!this.consumerNo) {
//       this.error = 'Consumer Number is required';
//       return;
//     }

//     if (!this.service.customerExists(this.consumerNo)) {
//       this.error = 'Invalid Consumer Number';
//       return;
//     }

//     this.bills = this.service.getBillsByConsumer(this.consumerNo);
//   }

//   get filteredBills() {
//     let result = [...this.bills];

//     if (this.statusFilter !== 'All') {
//       result = result.filter(b => b.paymentStatus === this.statusFilter);
//     }

//     if (this.periodFilter === 'Last6') {
//       result = result.slice(0, 6);
//     }

//     return result;
//   }

//   viewDetails(bill: any) {
//     this.selectedBill = bill;
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { AdminViewBillService } from '../../services/admin-view-bill.service';
import { AdminViewBillService } from '../../services/admin-view-bill.service';

@Component({
  selector: 'app-admin-view-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view-bill.component.html',
  styleUrl: './admin-view-bill.component.css'
})
export class AdminViewBillComponent {

  consumerNo = '';
  error = '';
  selectedBill: any = null;

  // ✅ Filters
  paymentStatusFilter = 'All';
  periodFilter = 'All';
  selectedYear = '';

  bills: any[] = [];

  constructor(public service: AdminViewBillService) {}

  search() {
    this.error = '';
    this.selectedBill = null;

    if (!this.consumerNo) {
      this.error = 'Consumer Number is required';
      return;
    }

    if (!this.service.customerExists(this.consumerNo)) {
      this.error = 'Invalid Consumer Number';
      return;
    }

    this.bills = this.service.getBillsByConsumer(this.consumerNo);
  }

  get filteredBills() {
    let result = [...this.bills];

    // ✅ Payment Status Filter
    if (this.paymentStatusFilter !== 'All') {
      result = result.filter(b => b.paymentStatus === this.paymentStatusFilter);
    }

    // ✅ Last 6 months filter
    if (this.periodFilter === 'Last6') {
      result = result.slice(0, 6);
    }

    // ✅ Specific year filter
    if (this.periodFilter === 'Year' && this.selectedYear) {
      result = result.filter(b =>
        b.billingPeriod.includes(this.selectedYear)
      );
    }

    return result;
  }

  viewDetails(bill: any) {
    this.selectedBill = bill;
  }
}

