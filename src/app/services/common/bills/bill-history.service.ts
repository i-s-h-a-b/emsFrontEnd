import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillHistoryService {

  // ✅ Dummy billing history (last 6 months)
  bills = [
    {
      billDate: '2025-12-05',
      billingPeriod: 'Dec 2025',
      dueDate: '2026-01-15',
      billAmount: 1200,
      paymentStatus: 'Paid',
      paymentDate: '2025-12-10',
      paymentMode: 'Debit Card'
    },
    {
      billDate: '2025-11-05',
      billingPeriod: 'Nov 2025',
      dueDate: '2025-12-15',
      billAmount: 1100,
      paymentStatus: 'Paid',
      paymentDate: '2025-11-12',
      paymentMode: 'Net Banking'
    },
    {
      billDate: '2025-10-05',
      billingPeriod: 'Oct 2025',
      dueDate: '2025-11-15',
      billAmount: 950,
      paymentStatus: 'Unpaid',
      paymentDate: '-',
      paymentMode: '-'
    },
    {
      billDate: '2025-09-05',
      billingPeriod: 'Sep 2025',
      dueDate: '2025-10-15',
      billAmount: 900,
      paymentStatus: 'Paid',
      paymentDate: '2025-09-11',
      paymentMode: 'Credit Card'
    },
    {
      billDate: '2025-08-05',
      billingPeriod: 'Aug 2025',
      dueDate: '2025-09-15',
      billAmount: 1050,
      paymentStatus: 'Paid',
      paymentDate: '2025-08-10',
      paymentMode: 'Debit Card'
    },
    {
      billDate: '2025-07-05',
      billingPeriod: 'Jul 2025',
      dueDate: '2025-08-15',
      billAmount: 980,
      paymentStatus: 'Paid',
      paymentDate: '2025-07-12',
      paymentMode: 'Net Banking'
    }
  ];
}
