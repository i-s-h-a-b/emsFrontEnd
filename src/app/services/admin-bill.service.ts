import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminBillService {

  // ✅ Existing consumers (mimics DB)
  consumers = ['C1001', 'C1002', 'C1003'];

  // ✅ Existing bills (mimics DB table)
  bills: any[] = [];

  consumerExists(consumerNo: string): boolean {
    return this.consumers.includes(consumerNo);
  }

  isDuplicateBill(consumerNo: string, billingPeriod: string): boolean {
    return this.bills.some(
      b => b.consumerNo === consumerNo && b.billingPeriod === billingPeriod
    );
  }

  saveBill(bill: any) {
    bill.billId = 'BILL-' + Math.floor(Math.random() * 100000);
    this.bills.push(bill);
    return bill;
  }
}