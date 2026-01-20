
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillsService } from '../../services/common/bills/bills.service';

@Component({
  selector: 'app-view-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-bills.component.html',
  styleUrls: ['./view-bills.component.css']
})
export class ViewBillsComponent {

  constructor(
    public billsService: BillsService,
    private router: Router
  ) {}

  /**
   * Optional: you can remove this if you don't show a footer total anymore.
   * Keeping it here in case you want to show totals elsewhere later.
   */
  get totalPayable(): number {
    return this.billsService.bills
      .filter(b => b.paymentStatus !== 'Paid')
      .reduce((sum, b) => sum + b.dueAmount, 0);
  }

  /**
   * When user clicks Pay Now for a bill:
   *  - Clear other selections
   *  - Mark ONLY this bill as selected
   *  - Continue to bill summary page
   */
  payBill(bill: any) {
    // Clear existing selections
    this.billsService.bills.forEach(b => (b.selected = false));

    // Select only this bill
    bill.selected = true;

    // If you prefer, you can also store the selected bill explicitly:
    // this.billsService.selectedBill = bill;

    // Navigate to summary for further processing
    this.router.navigate(['/bill-summary']);
  }

}
