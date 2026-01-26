import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

/* ===== DTOs ===== */

export interface CreateSmeRequest {
  fname: string;
  lname: string;
  mobileNumber: string;
  userEmail: string;
  username: string;
  password: string;
}

export interface SmeResponse {
  employeeId: number;
  fname: string;
  lname: string;
  mobileNumber: string;
  userId: number;
  userEmail: string;
}
export interface SmeListingResponse {
  smeId: number;
  fname: string;
  lname: string;
  mobileNumber: string;
  userId: number;
  userEmail: string;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSmeService {

  private readonly baseUrl = environment.apiBaseUrl;
  private readonly apiUrl = `${this.baseUrl}api/admin/smes`;

  constructor(private http: HttpClient) {}

  /* ADD SME */
  createSme(request: CreateSmeRequest): Observable<SmeResponse> {
    return this.http.post<SmeResponse>(
      `${this.baseUrl}api/admin/addsme`,
      request
    );
  }

  /* LIST SME (ADMIN) */
  getSmes(
    page = 0,
    size = 20,
    smeId?: number
  ): Observable<PageResponse<SmeListingResponse>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (smeId) {
      params = params.set('smeId', smeId);
    }

    return this.http.get<PageResponse<SmeListingResponse>>(
      this.apiUrl,
      { params }
    );
  }
}
