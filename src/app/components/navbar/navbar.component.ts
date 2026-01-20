import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoleService, UserRole } from '../../services/common/role.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly roleService = inject(RoleService);
  username = "Ramesh Kumar"
 

  // Using your RoleService as-is (no changes)
  get role(): UserRole {
    return this.roleService.role;
  }
  get isLoggedIn(): boolean {
    return !!this.roleService.token;
  }

  usernameF(){
    switch (this.role) {
      case 'ADMIN': return "admin20Nov ";
      case 'SME': return "sme20Nov ";
      default: return "user20Nov";
    }
  }
   

  brandLink(): string {
    // Brand click goes to role-specific root
    switch (this.role) {
      case 'ADMIN': return '/admin';
      case 'SME': return '/sme';
      case 'CUSTOMER' : return '/customer'
      default: return '/';
    }
  }

  logout(): void {
    // Minimal logout (clears token)
    this.roleService.token = null;
    this.roleService.clear();
  }
}

