import { Injectable } from '@angular/core';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SME';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private static readonly ROLE_KEY = 'role';
  private static readonly TOKEN_KEY = 'token';

  private _role: UserRole = 'CUSTOMER'; // Default role
  private _token: string | null = null; // Token

  constructor() {
    // Load from localStorage if available
    const storedRole = localStorage.getItem(RoleService.ROLE_KEY) as UserRole;
    const storedToken = localStorage.getItem(RoleService.TOKEN_KEY);

    if (storedRole) this._role = storedRole;
    if (storedToken) this._token = storedToken;
  }

  // --- Getters ---
  get role(): UserRole {
    return this._role;
  }

  get token(): string | null {
    return this._token;
  }

  // --- Setters ---
  set role(value: UserRole) {
    this._role = value;
    localStorage.setItem(RoleService.ROLE_KEY, value);
  }

  set token(value: string | null) {
    this._token = value;
    if (value) {
      localStorage.setItem(RoleService.TOKEN_KEY, value);
    } else {
      localStorage.removeItem(RoleService.TOKEN_KEY);
    }
  }

  // --- Clear all ---
  clear(): void {
    this._role = 'CUSTOMER';
    this._token = null;
    localStorage.removeItem(RoleService.ROLE_KEY);
    localStorage.removeItem(RoleService.TOKEN_KEY);
  }
}
