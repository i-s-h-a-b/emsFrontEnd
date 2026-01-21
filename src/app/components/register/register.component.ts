

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterService, RegisterRequest } from '../../services/apis/register/register.service';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  registerObj: any = {
    username: '',
    fname: '',
    lname: '',
    address: '',
    email: '',
    mobileNumber: '',
    customerType: '',
    electricalSection: '',
    consumerNumber: '',
    password: '',
    confirmPassword: ''
  };


  constructor(
    private router: Router,
    private registerService: RegisterService
  ) { }

  confirmationMessage: string = '';
  isRegistering: boolean = false;
  showPassword: boolean = false;
  usernameTaken: boolean = false;
  generalErrorMessage: string = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async checkUsername() {
    const username = this.registerObj.username;
    if (!username || username.length < 3) {
      this.usernameTaken = false;
      return;
    }

    try {
      this.usernameTaken = await this.registerService.checkUsernameTaken(username);
    } catch (err) {
      // If the check fails (e.g. network error), just proceed and let the submit handle it
      console.warn('Failed to check username availability', err);
    }
  }

  async onRegister(form: any) {
    if (form.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.isRegistering = true;

    try {
      // 1. Check if username is taken
      const isTaken = await this.registerService.checkUsernameTaken(this.registerObj.username);
      if (isTaken) {
        alert('Username is already taken. Please choose another one.');
        this.isRegistering = false;
        return;
      }

      // 2. Prepare request payload (fix typo for backend: consumerNumber -> cousumerNumber)
      const request: RegisterRequest = {
        username: this.registerObj.username,
        password: this.registerObj.password,
        email: this.registerObj.email,
        cousumerNumber: this.registerObj.consumerNumber,
        fname: this.registerObj.fname,
        lname: this.registerObj.lname,
        address: this.registerObj.address,
        mobileNumber: this.registerObj.mobileNumber,
        electricalSection: this.registerObj.electricalSection,
        customerType: this.registerObj.customerType
      };

      // 3. Call Register API
      const user = await this.registerService.register(request);

      this.confirmationMessage = `Registration successful! check console for response`;
      console.log(user);

      alert(`Registration successful!\nName: ${user.fname} ${user.lname}\nEmail: ${user.email}`);

      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      this.isRegistering = false;
    }
  }
}

