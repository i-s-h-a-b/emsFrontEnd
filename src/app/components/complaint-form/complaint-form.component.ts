import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ComplaintRegisterService,
  ComplaintType,
  PreferredContactMethod,
  CreateComplaintRequest,
  ComplaintResponse
} from '../../services/apis/complaintRegister/complaint-register.service';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.css']
})
export class ComplaintFormComponent implements OnInit {

  // Default values
  registeredEmail = 'user@example.com';
  registeredPhone = '9876543210';

  complaintTypes: ComplaintType[] = [
    'BILLING_ISSUE',
    'POWER_OUTAGE',
    'METER_FAULT',
    'CONNECTION_REQUEST'
  ];

  descriptionMaxLen = 5000; // Updated to match backend constraint

  form!: FormGroup;
  submittedComplaint = signal<ComplaintResponse | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private complaintRegisterService: ComplaintRegisterService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      complaintType: ['', Validators.required],
      description: ['', [
        Validators.required,
        Validators.minLength(10), // Backend min size
        Validators.maxLength(this.descriptionMaxLen)
      ]],
      preferredContactMethod: ['EMAIL' as PreferredContactMethod, Validators.required],
      contactEmail: ['', [Validators.email]],
      contactPhone: ['', [Validators.pattern(/^[0-9]{10,15}$/)]], // Adjusted phone pattern
    });

    // Autofill defaults (optional - can be removed if not needed)
    this.form.patchValue({
      contactEmail: this.registeredEmail,
      contactPhone: this.registeredPhone
    });

    // Dynamic validation
    this.form.get('preferredContactMethod')?.valueChanges.subscribe((method: PreferredContactMethod) => {
      this.updateContactValidators(method);
    });

    // Initial validation check
    this.updateContactValidators(this.form.get('preferredContactMethod')?.value);
  }

  private updateContactValidators(method: PreferredContactMethod): void {
    const emailCtrl = this.form.get('contactEmail');
    const phoneCtrl = this.form.get('contactPhone');

    if (method === 'EMAIL') {
      // Email is preferred, maybe required? Backend says "optional override" usually,
      // but if it's preferred, we probably want it filled.
      // Adjust logic as per specific business rule. 
      // Assuming if preferred, we encourage it, but backend constraints say "optional".
      // Let's keep strict validation if the user chooses it as preferred.
      emailCtrl?.addValidators([Validators.required, Validators.email]);
      phoneCtrl?.removeValidators([Validators.required]);
      phoneCtrl?.setValidators([Validators.pattern(/^[0-9]{10,15}$/)]);
    } else {
      phoneCtrl?.addValidators([Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]);
      emailCtrl?.removeValidators([Validators.required]);
      emailCtrl?.setValidators([Validators.email]);
    }
    emailCtrl?.updateValueAndValidity();
    phoneCtrl?.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const v = this.form.value;

    const request: CreateComplaintRequest = {
      complaintType: v.complaintType,
      description: v.description,
      preferredContactMethod: v.preferredContactMethod,
      // Only send if they have values
      contactEmail: v.contactEmail || undefined,
      contactPhone: v.contactPhone || undefined
    };

    this.complaintRegisterService.createComplaint(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.submittedComplaint.set(response);
        setTimeout(() => document.getElementById('confirmation')?.scrollIntoView({ behavior: 'smooth' }), 50);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Submission failed', err);
        this.errorMessage.set('Failed to submit complaint. Please try again later.');
      }
    });
  }

  resetPage(): void {
    this.form.reset({
      complaintType: '',
      description: '',
      preferredContactMethod: 'EMAIL',
    });
    this.submittedComplaint.set(null);
    this.errorMessage.set(null);

    // Refresh
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/complaints/new']);
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']); // Update to correct dashboard route if needed
  }

  viewStatus(): void {
    // Navigate to status page for this specific complaint usually
    // this.router.navigate(['/complaints', this.submittedComplaint()?.complaintId]);
    this.router.navigate(['/complaints/history']);
  }
}
