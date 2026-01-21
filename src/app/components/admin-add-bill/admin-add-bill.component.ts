import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminBillsService, CreateBillRequest, BillDTO } from '../../services/apis/bills/admin-bills.service';

@Component({
  selector: 'app-admin-add-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-bill.component.html',
  styleUrl: './admin-add-bill.component.css'
})
export class AdminAddBillComponent {

  message = signal<string>('');
  error = signal<string>('');
  savedBill = signal<BillDTO | null>(null);
  isLoading = signal(false);

  billForm;

  constructor(
    private fb: FormBuilder,
    private adminBillsService: AdminBillsService
  ) {
    this.billForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1)]],
      billingPeriod: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
      billDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      disconnectionDate: [''],
      billAmount: ['', [Validators.required, Validators.min(0.01)]],
      lateFee: [0, [Validators.min(0)]],
      status: ['UNPAID', Validators.required]
    });
  }

  async saveBill(): Promise<void> {
    this.error.set('');
    this.message.set('');
    this.savedBill.set(null);

    if (this.billForm.invalid) {
      this.billForm.markAllAsTouched();
      this.error.set('Please fill all required fields correctly');
      return;
    }

    // Extract values
    const customerId = this.billForm.get('customerId')?.value;
    const billDate = this.billForm.get('billDate')?.value;
    const dueDate = this.billForm.get('dueDate')?.value;

    // Guard required fields
    if (!customerId || !billDate || !dueDate) {
      this.error.set('All required fields must be filled');
      return;
    }

    // Date validation
    if (new Date(billDate) >= new Date(dueDate)) {
      this.error.set('Bill Date must be before Due Date');
      return;
    }

    this.isLoading.set(true);

    try {
      // Prepare the request payload
      const billData: CreateBillRequest = {
        billingPeriod: this.billForm.get('billingPeriod')?.value ?? '',
        billDate: billDate,
        dueDate: dueDate,
        disconnectionDate: this.billForm.get('disconnectionDate')?.value || undefined,
        billAmount: Number(this.billForm.get('billAmount')?.value ?? 0),
        lateFee: Number(this.billForm.get('lateFee')?.value ?? 0),
        status: this.billForm.get('status')?.value ?? 'UNPAID'
      };

      // Call the API
      const savedBillData = await this.adminBillsService.createBill(Number(customerId), billData);

      this.savedBill.set(savedBillData);
      this.message.set('Bill added successfully');
      this.isLoading.set(false);

      // Reset form
      this.billForm.reset({ lateFee: 0, status: 'UNPAID' });

    } catch (err: any) {
      this.isLoading.set(false);
      console.error('Error creating bill:', err);

      // Handle different error scenarios
      if (err?.status === 404) {
        this.error.set('Customer not found. Please check the Customer ID.');
      } else if (err?.status === 400) {
        this.error.set(err?.error?.message || 'Invalid bill data. Please check your inputs.');
      } else if (err?.status === 409) {
        this.error.set('Bill already exists for this customer and billing period.');
      } else {
        this.error.set(err?.error?.message || 'Failed to create bill. Please try again.');
      }
    }
  }

}
