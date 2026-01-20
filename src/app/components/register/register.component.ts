

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,RouterLink],
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
    private router: Router
  ) {}

  confirmationMessage: string = '';


  onRegister(form: any) {
    if (form.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }


    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    
    // Generate random Customer ID
    const customerId = 'CUST-' + Math.floor(100000 + Math.random() * 900000);
    
    
    // Simulate saving to DB (replace with API call)
    // console.log('Saving user:', {
      //   ...this.registerObj
      // });
      
      this.router.navigate(['/login']);

    alert( `Registration successful!
      Customer ID: ${customerId},
      Name: ${this.registerObj.fullName},
      Email: ${this.registerObj.email}`);
  }
}
