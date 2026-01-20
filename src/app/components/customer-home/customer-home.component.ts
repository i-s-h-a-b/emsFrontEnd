import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-home',
  imports: [CommonModule],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent {
  customerName = 'Ramesh Kumar';
  accountNumber = 'CNS123456';
  address = 'Bangalore, Karnataka';

  bill = {
    period: 'June 2026',
    dueDate: '15-07-2026',
    amount: 1240,
    status: 'UNPAID'
  };
}