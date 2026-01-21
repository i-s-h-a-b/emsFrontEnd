import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Enums matching backend
export enum ElectricalSectionEnum {
  OFFICE = 'OFFICE',
  REGION = 'REGION',
  EAST_ZONE = 'EAST_ZONE',
  WEST_ZONE = 'WEST_ZONE',
  NORTH_ZONE = 'NORTH_ZONE',
  SOUTH_ZONE = 'SOUTH_ZONE'
}

export enum CustomerTypeEnum {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL'
}

// Customer interface matching backend CustomerListingResponse
export interface Customer {
  customerId: number;
  cousumerNumber?: string;
  fname: string;
  lname: string;
  address: string;
  mobileNumber: string;
  electricalSection: ElectricalSectionEnum;
  customerType: CustomerTypeEnum;
  refinedCustomerId: string;
}

// Pageable response from backend
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/admin/listcustomers';

  constructor(private http: HttpClient) { }

  /**
   * Fetch customers with optional filters and pagination
   */
  getCustomers(
    electricalSection?: ElectricalSectionEnum,
    customerType?: CustomerTypeEnum,
    page: number = 0,
    size: number = 20
  ): Observable<PageableResponse<Customer>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (electricalSection) {
      params = params.set('electricalSection', electricalSection);
    }

    if (customerType) {
      params = params.set('customerType', customerType);
    }

    return this.http.get<PageableResponse<Customer>>(this.apiUrl, { params });
  }
}
