
import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ComplaintService } from '../../services/common/complain/complaint.service';
import { Complaint,ContactMethod } from '../../model/complain';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.css']
})
export class ComplaintFormComponent implements OnInit {

  // Autofilled & editable contact info (you can load from user profile later)
  registeredEmail = 'user@example.com';
  registeredPhone = '9876543210';

  // Types & dependent categories
  complaintTypes = [
    'Billing Issue',
    'Power Outage',
    'Meter Reading Issue'
  ];

  typeToCategories: Record<string, string[]> = {
    'Billing Issue': ['Overcharge', 'Late Payment', 'Incorrect Tariff'],
    'Power Outage': ['Scheduled Maintenance', 'Unexpected Outage', 'Transformer Fault'],
    'Meter Reading Issue': ['Reading Not Taken', 'Faulty Meter', 'Reading Discrepancy']
  };

  // Signal to hold currently available categories
  categories = signal<string[]>([]);
  descriptionMaxLen = 500;

  // Reactive form (declare first, initialize later to avoid “fb used before initialization”)
  form!: FormGroup;

  // Confirmation state
  submittedComplaint = signal<Complaint | null>(null);

  // Estimated resolution (computed for confirmation only, not stored in model)
  estimatedResolutionHours = computed(() => {
    const type = this.submittedComplaint()?.complaintType;
    if (!type) return null;
    const map: Record<string, number> = {
      'Billing Issue': 48,
      'Power Outage': 4,
      'Meter Reading Issue': 24
    };
    return map[type] ?? 72;
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    // Initialize the form here (fb is available now)
    this.form = this.fb.group({
      complaintType: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(this.descriptionMaxLen)]],
      contactMethod: ['email' as ContactMethod, Validators.required],
      contactEmail: ['', [Validators.email]],
      contactPhone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    });

    // Autofill contact fields
    this.form.patchValue({
      contactEmail: this.registeredEmail,
      contactPhone: this.registeredPhone
    });

    // Update categories when complaintType changes
    this.form.get('complaintType')?.valueChanges.subscribe(type => {
      const list = this.typeToCategories[type || ''] || [];
      this.categories.set(list);
      // reset category when type changes
      this.form.get('category')?.setValue('');
    });

    // Dynamic validation based on contactMethod
    this.form.get('contactMethod')?.valueChanges.subscribe(method => {
      const emailCtrl = this.form.get('contactEmail');
      const phoneCtrl = this.form.get('contactPhone');

      if (method === 'email') {
        emailCtrl?.addValidators([Validators.required, Validators.email]);
        phoneCtrl?.removeValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
      } else {
        phoneCtrl?.addValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
        emailCtrl?.removeValidators([Validators.required, Validators.email]);
      }
      emailCtrl?.updateValueAndValidity();
      phoneCtrl?.updateValueAndValidity();
    });

    // Trigger initial validators for default contact method
    this.form.get('contactMethod')?.updateValueAndValidity({ onlySelf: true });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const saved = this.complaintService.addComplaint({
      complaintType: v.complaintType!,
      category: v.category!,
      description: v.description!,
      contactMethod: v.contactMethod!,
      contactEmail: v.contactMethod === 'email' ? v.contactEmail! : undefined,
      contactPhone: v.contactMethod === 'phone' ? v.contactPhone! : undefined,
    });

    this.submittedComplaint.set(saved);

    // Smooth scroll to confirmation
    setTimeout(() => document.getElementById('confirmation')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  resetPage(): void {
    // Reset form to initial state
    this.form.reset({
      complaintType: '',
      category: '',
      description: '',
      contactMethod: 'email',
      contactEmail: this.registeredEmail,
      contactPhone: this.registeredPhone
    });
    this.categories.set([]);
    this.submittedComplaint.set(null);

    // Refresh route as requested
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/complaints/new']);
    });
    // Alternatively: window.location.reload(); (but router refresh is smoother)
  }

  goToDashboard(): void {
    // You can change this to your main dashboard later
    this.router.navigate(['/complaints/history']);
  }

  viewStatus(): void {
    this.router.navigate(['/complaints/status']);
  }
}
