import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  //  Dummy bills data
  // This mimics backend response for View Bills page
  bills = [
    {
      consumerNo: 'C1001',
      billNumber: 'BILL001',
      paymentStatus: 'Unpaid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Dec 2025',
      billDate: '05-12-2025',
      dueDate: '15-01-2026',
      disconnectionDate: '25-01-2026',
      dueAmount: 1200,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL002',
      paymentStatus: 'Paid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Nov 2025',
      billDate: '05-11-2025',
      dueDate: '15-12-2025',
      disconnectionDate: '-',
      dueAmount: 1000,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL003',
      paymentStatus: 'Unpaid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Oct 2025',
      billDate: '05-10-2025',
      dueDate: '15-11-2025',
      disconnectionDate: '25-11-2025',
      dueAmount: 950,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL004',
      paymentStatus: 'Paid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Sep 2025',
      billDate: '05-09-2025',
      dueDate: '15-10-2025',
      disconnectionDate: '-',
      dueAmount: 900,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL005',
      paymentStatus: 'Unpaid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Aug 2025',
      billDate: '05-08-2025',
      dueDate: '15-09-2025',
      disconnectionDate: '25-09-2025',
      dueAmount: 1100,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL006',
      paymentStatus: 'Paid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Jul 2025',
      billDate: '05-07-2025',
      dueDate: '15-08-2025',
      disconnectionDate: '-',
      dueAmount: 980,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL007',
      paymentStatus: 'Unpaid',
      connectionType: 'Commercial',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Jun 2025',
      billDate: '05-06-2025',
      dueDate: '15-07-2025',
      disconnectionDate: '25-07-2025',
      dueAmount: 2200,
      payableAmount: 0,
      selected: false
    },
    {
      consumerNo: 'C1001',
      billNumber: 'BILL008',
      paymentStatus: 'Paid',
      connectionType: 'Commercial',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'May 2025',
      billDate: '05-05-2025',
      dueDate: '15-06-2025',
      disconnectionDate: '-',
      dueAmount: 2000,
      payableAmount: 0,
      selected: false
    }
  ];
}
