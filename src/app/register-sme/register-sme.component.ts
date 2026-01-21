import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSmeService, CreateSmeRequest, SmeResponse } from '../services/apis/adminSmeList/admin-sme.service';

@Component({
  selector: 'app-add-sme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-sme.component.html',
  styleUrls: ['./register-sme.component.css']
})
export class RegisterSmeComponent {

  form!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  createdSme = signal<SmeResponse | null>(null);

  constructor(
    private fb: FormBuilder,
    private adminSmeService: AdminSmeService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fname: ['', [Validators.required, Validators.maxLength(100)]],
      lname: ['', [Validators.required, Validators.maxLength(100)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      userEmail: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: CreateSmeRequest = this.form.value;

    this.adminSmeService.createSme(request).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.createdSme.set(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        this.errorMessage.set(err?.error?.message || 'Failed to create SME');
      }
    });
  }

  reset(): void {
    this.form.reset();
    this.createdSme.set(null);
    this.errorMessage.set(null);
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
