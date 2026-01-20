import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillsService } from '../../services/common/bills/bills.service';

@Component({
  selector: 'app-bill-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-summary.component.html',
  styleUrl: './bill-summary.component.css'
})
export class BillSummaryComponent {

  paymentMethod: string = '';

  constructor(
    public billsService: BillsService,
    private router: Router
  ) {}

  get selectedBills() {
    return this.billsService.bills.filter(b => b.selected);
  }

  get totalAmount(): number {
    return this.selectedBills.reduce((sum, b) => sum + b.dueAmount, 0);
  }

  proceedToPayment() {
  this.router.navigate(['/pay-bill']);
}


  goBack() {
    this.router.navigate(['/view-bills']);
  }
}



