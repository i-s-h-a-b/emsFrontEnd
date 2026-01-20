import { CommonModule } from '@angular/common';
import { Component , inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginApiService,LoginRequest } from '../../services/apis/login/login-api.service';
import { compileNgModule } from '@angular/compiler';
import { RoleService,UserRole } from '../../services/common/role.service';
// {
//   "username": "user20Nov",
//   "password": "Pass@1234"
// }

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj: LoginRequest = {
    username: '',
    password: ''
  };

  private readonly roleService = inject(RoleService);

  loading = false;
  errorMessage = '';

  constructor(
    private loginApi: LoginApiService,
    private router: Router
  ) {}

  async onLogin() {
    this.errorMessage = '';
    this.loading = true;
    try {
      const res = await this.loginApi.login(this.loginObj);

      // If your service set token/role in RoleService, just navigate.
      if (res?.token && res?.role) {
        // console.log(res.token)
        // console.log(res.role)   'CUSTOMER' | 'ADMIN' | 'SME'
        this.roleService.role = res.role as UserRole;
        this.roleService.token = res.token;
        if(res.role === 'CUSTOMER'){
          await this.router.navigate(['/customer']);
        }else if(res.role === 'ADMIN'){
          await this.router.navigate(['/admin']);
        }else{
          await this.router.navigate(['/sme']);
        }

      } else {
        this.errorMessage ='Login failed: missing token or role.';
      }
    } catch (err: any) {
      this.errorMessage = 'Login failed. Invalid credentials.';
    } finally {
      this.loading = false;
    }
  }
}
