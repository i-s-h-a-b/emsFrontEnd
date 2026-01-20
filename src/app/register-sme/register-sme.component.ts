
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-sme',
  imports: [FormsModule, CommonModule],
  templateUrl: './register-sme.component.html',
  styleUrl: './register-sme.component.css'
})
export class RegisterSmeComponent {

  registerObj: any = {
    consumerNumber: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    userId: '',
    password: '',
    confirmPassword: ''
  };

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

    const empId = 'SME-' + Math.floor(100000 + Math.random() * 900000);

    alert( `Registration successful! 
      Employee ID: ${empId}, 
      Name: ${this.registerObj.fullName}, 
      Email: ${this.registerObj.email}`);
  }
}
