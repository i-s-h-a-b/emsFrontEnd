import { Injectable } from '@angular/core';
import { Customer } from '../../../model/customer';

@Injectable({
  providedIn: 'root'
})
export class ConsumerListService {
  private consumers: Customer[] = [];

  /** Get a customer by their userId */
  getCustomerById(id: number): Customer | undefined {
    return this.consumers.find(c => c.userId === id);
  }

  /** Push/Add a new customer to the list */
  pushCustomer(customer: Customer): void {
    // Optional: prevent duplicates by userId
    const exists = this.consumers.some(c => c.userId === customer.userId);
    if (!exists) {
      this.consumers.push(customer);
    } else {
      // If you prefer to update when exists:
      const idx = this.consumers.findIndex(c => c.userId === customer.userId);
      this.consumers[idx] = customer;
    }
  }

  /** (Optional) Get all customers */
  getAllCustomers(): Customer[] {
    return [...this.consumers]; // return a copy
  }
}

