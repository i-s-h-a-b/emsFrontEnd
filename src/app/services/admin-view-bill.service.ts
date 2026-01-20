

// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminViewBillService {

//   // ✅ Dummy customers
//   customers = ['C1001', 'C1002', 'C1003'];

//   // ✅ Expanded dummy bill history
//   bills = [
//     // ===== C1001 =====
//     {
//       billId: 'BILL1001',
//       consumerNo: 'C1001',
//       billingPeriod: 'Jan 2026',
//       billDate: '2026-01-05',
//       dueDate: '2026-02-15',
//       billAmount: 1300,
//       lateFee: 0,
//       paymentStatus: 'Unpaid',
//       paymentDate: '-'
//     },
//     {
//       billId: 'BILL1002',
//       consumerNo: 'C1001',
//       billingPeriod: 'Dec 2025',
//       billDate: '2025-12-05',
//       dueDate: '2026-01-15',
//       billAmount: 1200,
//       lateFee: 0,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-12-10'
//     },
//     {
//       billId: 'BILL1003',
//       consumerNo: 'C1001',
//       billingPeriod: 'Nov 2025',
//       billDate: '2025-11-05',
//       dueDate: '2025-12-15',
//       billAmount: 1100,
//       lateFee: 50,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-11-20'
//     },
//     {
//       billId: 'BILL1004',
//       consumerNo: 'C1001',
//       billingPeriod: 'Oct 2025',
//       billDate: '2025-10-05',
//       dueDate: '2025-11-15',
//       billAmount: 980,
//       lateFee: 0,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-10-12'
//     },
//     {
//       billId: 'BILL1005',
//       consumerNo: 'C1001',
//       billingPeriod: 'Sep 2025',
//       billDate: '2025-09-05',
//       dueDate: '2025-10-15',
//       billAmount: 950,
//       lateFee: 30,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-09-18'
//     },

//     // ===== C1002 =====
//     {
//       billId: 'BILL2001',
//       consumerNo: 'C1002',
//       billingPeriod: 'Jan 2026',
//       billDate: '2026-01-06',
//       dueDate: '2026-02-16',
//       billAmount: 1800,
//       lateFee: 0,
//       paymentStatus: 'Unpaid',
//       paymentDate: '-'
//     },
//     {
//       billId: 'BILL2002',
//       consumerNo: 'C1002',
//       billingPeriod: 'Dec 2025',
//       billDate: '2025-12-06',
//       dueDate: '2026-01-16',
//       billAmount: 1700,
//       lateFee: 0,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-12-14'
//     },
//     {
//       billId: 'BILL2003',
//       consumerNo: 'C1002',
//       billingPeriod: 'Nov 2025',
//       billDate: '2025-11-06',
//       dueDate: '2025-12-16',
//       billAmount: 1650,
//       lateFee: 0,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-11-13'
//     },
//     {
//       billId: 'BILL2004',
//       consumerNo: 'C1002',
//       billingPeriod: 'Oct 2025',
//       billDate: '2025-10-06',
//       dueDate: '2025-11-16',
//       billAmount: 1600,
//       lateFee: 100,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-10-25'
//     },

//     // ===== C1003 =====
//     {
//       billId: 'BILL3001',
//       consumerNo: 'C1003',
//       billingPeriod: 'Jan 2026',
//       billDate: '2026-01-07',
//       dueDate: '2026-02-17',
//       billAmount: 2100,
//       lateFee: 0,
//       paymentStatus: 'Unpaid',
//       paymentDate: '-'
//     },
//     {
//       billId: 'BILL3002',
//       consumerNo: 'C1003',
//       billingPeriod: 'Dec 2025',
//       billDate: '2025-12-07',
//       dueDate: '2026-01-17',
//       billAmount: 2000,
//       lateFee: 0,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-12-15'
//     },
//     {
//       billId: 'BILL3003',
//       consumerNo: 'C1003',
//       billingPeriod: 'Nov 2025',
//       billDate: '2025-11-07',
//       dueDate: '2025-12-17',
//       billAmount: 1950,
//       lateFee: 75,
//       paymentStatus: 'Paid',
//       paymentDate: '2025-11-28'
//     }
//   ];

//   customerExists(consumerNo: string): boolean {
//     return this.customers.includes(consumerNo);
//   }

//   getBillsByConsumer(consumerNo: string) {
//     return this.bills
//       .filter(b => b.consumerNo === consumerNo)
//       .sort((a, b) => b.billingPeriod.localeCompare(a.billingPeriod));
//   }
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminViewBillService {

  customers = ['C1001', 'C1002', 'C1003'];

  bills: any[] = [];

  constructor() {
    // ✅ Generate 20 dummy bills per customer
    this.customers.forEach(consumerNo => {
      for (let i = 0; i < 20; i++) {

        const monthIndex = i % 12;
        const year = 2025 + Math.floor(i / 12);
        const month = new Date(year, monthIndex).toLocaleString('default', { month: 'short' });

        this.bills.push({
          billId: `BILL-${consumerNo}-${i + 1}`,
          consumerNo: consumerNo,
          billingPeriod: `${month} ${year}`,
          billDate: `${year}-${String(monthIndex + 1).padStart(2, '0')}-05`,
          dueDate: `${year}-${String(monthIndex + 1).padStart(2, '0')}-15`,
          billAmount: 800 + (i * 50),
          lateFee: i % 4 === 0 ? 50 : 0,
          paymentStatus: i % 5 === 0 ? 'Unpaid' : 'Paid',
          paymentDate: i % 5 === 0 ? '-' : `${year}-${String(monthIndex + 1).padStart(2, '0')}-10`
        });
      }
    });
  }

  customerExists(consumerNo: string): boolean {
    return this.customers.includes(consumerNo);
  }

  getBillsByConsumer(consumerNo: string) {
    return this.bills
      .filter(b => b.consumerNo === consumerNo)
      .sort((a, b) => b.billingPeriod.localeCompare(a.billingPeriod));
  }
}
