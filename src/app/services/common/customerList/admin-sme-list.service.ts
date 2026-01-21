
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// SME interface matching backend SmeListingResponse (UPDATED)
export interface Sme {
  smeId: number;
  username: string;
  fname: string;
  lname: string;
  mobileNumber: string;
  userId: number;
  email: string;
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
export class AdminSmeService {
  // Using the controller path you implemented: GET /api/admin/smes
  private apiUrl = 'http://localhost:8080/api/admin/smes';

  constructor(private http: HttpClient) { }

  /**
   * Fetch SMEs with optional filter by smeId and pagination
   */
  getSmes(
    smeId?: number,
    page: number = 0,
    size: number = 20
  ): Observable<PageableResponse<Sme>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (smeId !== undefined && smeId !== null && !Number.isNaN(smeId)) {
      params = params.set('smeId', String(smeId));
    }

    return this.http.get<PageableResponse<Sme>>(this.apiUrl, { params });
  }
}
