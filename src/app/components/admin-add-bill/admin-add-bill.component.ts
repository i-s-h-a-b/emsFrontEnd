import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminBillService } from '../../services/admin-bill.service'; 

@Component({
  selector: 'app-admin-add-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-bill.component.html',
  styleUrl: './admin-add-bill.component.css'
})
export class AdminAddBillComponent {

  message = '';
  error = '';
  savedBill: any = null;

  billForm;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminBillService
  ) {
    this.billForm = this.fb.group({
      consumerNo: ['', Validators.required],
      billingPeriod: ['', Validators.required],
      billDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      disconnectionDate: ['', Validators.required],
      billAmount: ['', [Validators.required, Validators.min(1)]],
      lateFee: [0, [Validators.min(0)]],
      status: ['Unpaid', Validators.required]
    });
  }

  saveBill() {
  this.error = '';
  this.message = '';
  this.savedBill = null;

  if (this.billForm.invalid) {
    this.billForm.markAllAsTouched();
    return;
  }

  // ✅ Safely extract values
  const consumerNo = this.billForm.get('consumerNo')?.value;
  const billingPeriod = this.billForm.get('billingPeriod')?.value;
  const billDate = this.billForm.get('billDate')?.value;
  const dueDate = this.billForm.get('dueDate')?.value;

  // ✅ Guard required fields (TypeScript safety)
  if (!consumerNo || !billingPeriod || !billDate || !dueDate) {
    this.error = 'All required fields must be filled';
    return;
  }

  // ✅ Consumer validation
  if (!this.adminService.consumerExists(consumerNo)) {
    this.error = 'Consumer number does not exist';
    return;
  }

  // ✅ Date validation
  if (new Date(billDate) >= new Date(dueDate)) {
    this.error = 'Bill Date must be before Due Date';
    return;
  }

  // ✅ Duplicate bill validation
  if (this.adminService.isDuplicateBill(consumerNo, billingPeriod)) {
    this.error = 'Bill already exists for this consumer and billing period';
    return;
  }

  // ✅ Save bill (dummy DB)
  const saved = this.adminService.saveBill(this.billForm.value);
  this.savedBill = saved;
  this.message = 'Bill added successfully';

  this.billForm.reset({ lateFee: 0, status: 'Unpaid' });
}

}
