import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddSmeService, SmeCreateRequest } from '../../services/apis/addSme/add-sme.service';

@Component({
  selector: 'app-add-sme',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-sme.component.html',
  styleUrl: './add-sme.component.css'
})
export class AddSmeComponent {

  private router = inject(Router);
  private addSmeService = inject(AddSmeService);

  smeObj: any = {
    fname: '',
    lname: '',
    mobileNumber: '',
    userEmail: '',
    password: '',
    confirmPassword: '',
    username: ''
  };

  isSubmitting: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(form: any) {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      // Mark all controls as touched to trigger validation messages
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    if (this.smeObj.password !== this.smeObj.confirmPassword) {
      form.controls['confirmPassword'].markAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const request: SmeCreateRequest = {
        fname: this.smeObj.fname,
        lname: this.smeObj.lname,
        mobileNumber: this.smeObj.mobileNumber,
        userEmail: this.smeObj.userEmail,
        password: this.smeObj.password,
        username: this.smeObj.username
      };

      const response = await this.addSmeService.createSme(request);

      this.successMessage = `SME created successfully! Employee ID: ${response.employeeId}`;
      console.log('SME created:', response);

      // Reset form
      this.smeObj = {
        fname: '',
        lname: '',
        mobileNumber: '',
        userEmail: '',
        password: '',
        confirmPassword: '',
        username: ''
      };
      form.resetForm();

      // Optional: Navigate after success
      // setTimeout(() => {
      //   this.router.navigate(['/admin/smes']);
      // }, 2000);

    } catch (error: any) {
      console.error('Error creating SME:', error);
      this.errorMessage = error.message || 'Failed to create SME. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
