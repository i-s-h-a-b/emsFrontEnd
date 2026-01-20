import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BillsService } from '../../services/common/bills/bills.service';

@Component({
  selector: 'app-pay-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pay-bill.component.html',
  styleUrl: './pay-bill.component.css'
})
export class PayBillComponent {

  today = new Date();
  paymentSuccess = false;
  paymentError = '';
  showConfirm = false;

  paymentForm;

  constructor(
    private fb: FormBuilder,
    public billsService: BillsService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{16}$/) //  exactly 16 digits
        ]
      ],
      expiryDate: ['', Validators.required],
      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3,4}$/) //  3 or 4 digits
        ]
      ],
      cardHolder: ['', Validators.required]
    });
  }

  get selectedBills() {
    return this.billsService.bills.filter(b => b.selected);
  }

  get totalAmount(): number {
    return this.selectedBills.reduce((sum, b) => sum + b.dueAmount, 0);
  }

submit() {
  this.paymentError = '';

  if (this.paymentForm.invalid) {
    this.paymentForm.markAllAsTouched();
    return;
  }

  const expiryValue = this.paymentForm.get('expiryDate')?.value;

  //  Type guard (VERY IMPORTANT)
  if (!expiryValue) {
    this.paymentError = 'Expiry date is required';
    return;
  }

  const expiry = new Date(expiryValue);

  if (expiry < new Date()) {
    this.paymentError = 'Card is expired';
    return;
  }

  this.showConfirm = true;
}


  confirmPayment() {
    // ❌ Dummy failure rule (explicit & specific)
    if (this.paymentForm.value.cvv === '000') {
      this.paymentError = 'Incorrect CVV';
      this.showConfirm = false;
      return;
    }

    this.paymentSuccess = true;
    this.showConfirm = false;
  }
}



