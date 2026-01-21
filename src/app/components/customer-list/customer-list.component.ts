import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { CustomerService, Customer, ElectricalSectionEnum, CustomerTypeEnum, PageableResponse } from '../../services/customerList/customer.service';

import { Inject } from '@angular/core';
import { Customer, CustomerService, CustomerTypeEnum, ElectricalSectionEnum, PageableResponse } from '../../services/common/customerList/admin-customer-list.service';






@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './customer-list.component.html',
    styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
    customers: Customer[] = [];
    loading = false;
    error: string | null = null;

    // Filters
    selectedElectricalSection: ElectricalSectionEnum | '' = '';
    selectedCustomerType: CustomerTypeEnum | '' = '';

    // Pagination
    currentPage = 0;
    pageSize = 20;
    totalPages = 0;
    totalElements = 0;

    // Enums for template
    electricalSections = Object.values(ElectricalSectionEnum);
    customerTypes = Object.values(CustomerTypeEnum);

    // Expose Math to template
    Math = Math;

    constructor(@Inject(CustomerService) private customerService: CustomerService) {}

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.loading = true;
        this.error = null;

        const electricalSection = this.selectedElectricalSection || undefined;
        const customerType = this.selectedCustomerType || undefined;

        this.customerService.getCustomers(
            electricalSection as ElectricalSectionEnum,
            customerType as CustomerTypeEnum,
            this.currentPage,
            this.pageSize
        ).subscribe({
            next: (response: PageableResponse<Customer>) => {
                this.customers = response.content;
                this.totalPages = response.totalPages;
                this.totalElements = response.totalElements;
                this.loading = false;
            },
            // error: (err) => {
            //     this.error = 'Failed to load customers. Please ensure the backend is running.';
            //     console.error('Error loading customers:', err);
            //     this.loading = false;
            // }
        });
    }

    onFilterChange(): void {
        this.currentPage = 0; // Reset to first page when filters change
        this.loadCustomers();
    }

    clearFilters(): void {
        this.selectedElectricalSection = '';
        this.selectedCustomerType = '';
        this.currentPage = 0;
        this.loadCustomers();
    }

    onPageSizeChange(): void {
        this.currentPage = 0;
        this.loadCustomers();
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadCustomers();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadCustomers();
        }
    }

    goToPage(page: number): void {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.loadCustomers();
        }
    }

    get pageNumbers(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }
}
