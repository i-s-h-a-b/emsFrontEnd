import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { RoleService, UserRole } from '../../common/role.service';


export interface LoginRequest {
  username: string;
  password: string;  
}

export interface LoginResponse {
  token?: string;
  role?:string
}


@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private readonly baseUrl = environment.apiBaseUrl;
  private readonly roleService = inject(RoleService);


  constructor() { }

  
  async login(body: LoginRequest): Promise<LoginResponse> {
    const url = `${this.baseUrl}api/auth/login`;
    const apiBody = body; 

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  
        'Accept': 'application/json',       
      },
      body: JSON.stringify(apiBody),
    });

    if (!res.ok) {
      let message = `Login failed (${res.status} ${res.statusText})`;
      try {
        const err = await res.json();
        message = err?.message ?? message;
      } catch {
      }
      throw new Error(message);
    }
 
    const data = (await res.json()) as LoginResponse;
 
    if (data?.token && data?.role) {
      this.roleService.token = data.token;
      this.roleService.role = data.role as UserRole;
    }

    return data;
  }

}
