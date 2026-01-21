import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ComplaintFormComponent } from './components/complaint-form/complaint-form.component';
import { ComplaintHistoryComponent } from './components/complaint-history/complaint-history.component';
import { ComplaintStatusComponent } from './components/complaint-status/complaint-status.component';
import { CustomerComplaintComponent } from './pages/customer-complaint/customer-complaint.component';
import { adminGuard } from './guards/admin.guard';
import { authenticatedGuard } from './guards/authenticated.guard';
import { SmeComplaintsComponent } from './pages/sme-complaints/sme-complaints.component';
import { smeGuard } from './guards/sme.guard';
import { HomeComponent } from './pages/home/home.component';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { SmeHomeComponent } from './components/sme-home/sme-home.component';
import { AdminComplaintsComponent } from './components/admin-complaints/admin-complaints.component';
import { AdminComplaintSummaryComponent } from './components/admin-complaint-summary/admin-complaint-summary.component';
import { ViewBillsComponent } from './components/view-bills/view-bills.component';
import { PayBillComponent } from './components/pay-bill/pay-bill.component';
import { BillHistoryComponent } from './components/bill-history/bill-history.component';
import { BillSummaryComponent } from './components/bill-summary/bill-summary.component';
import { AdminAddBillComponent } from './components/admin-add-bill/admin-add-bill.component';
import { AdminViewBillComponent } from './components/admin-view-bill/admin-view-bill.component';
import { RegisterSmeComponent } from './register-sme/register-sme.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { ListSmeComponent } from './components/sme-list/sme-list.component';

/** ---- Placeholders (standalone) for demo ---- */
// @Component({ standalone: true, template: `<h1>Home</h1>` })
// export class HomeComponent {}

@Component({ standalone: true, template: `<h1>Bills</h1>` })
export class BillsComponent {}

@Component({ standalone: true, template: `<h1>Complain</h1>` })
export class ComplainComponent {}

// @Component({ standalone: true, template: `<h1>Login</h1>` })
// export class LoginComponent {}

// @Component({ standalone: true, template: `<h1>Register</h1>` })
// export class RegisterComponent {}

@Component({ standalone: true, template: `<h1>Profile</h1>` })
export class ProfileComponent {}

@Component({ standalone: true, template: `<h1>Admin Users</h1>` })
export class AdminUsersComponent {}

@Component({ standalone: true, template: `<h1>Admin Bills</h1>` })
export class AdminBillsComponent {}

// @Component({ standalone: true, template: `<h1>Admin Complains</h1>` })
// export class AdminComplainsComponent {}

@Component({ standalone: true, template: `<h1>SME Users</h1>` })
export class SmeUsersComponent {}

// @Component({ standalone: true, template: `<h1>SME Complains</h1>` })
// export class SmeComplainsComponent {}
/** ------------------------------------------- */
export const routes: Routes = [
  // Customer routes: localhost:4200/...
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // { path: 'bills', component: BillsComponent },
  { path: 'view-bills', component: ViewBillsComponent },
  { path: 'bill-summary', component: BillSummaryComponent },
  { path: 'pay-bill', component: PayBillComponent },
    { path: 'bill-history', component: BillHistoryComponent },
  { path: 'customer', component: CustomerHomeComponent },
  { path: 'complaints', component: CustomerComplaintComponent },
  { path: 'complaints/new', component: ComplaintFormComponent },
  { path: 'complaints/status', component: ComplaintStatusComponent},
  { path: 'complaints/history', component: ComplaintHistoryComponent },


  // Auth routes
  { path: 'login', component: LoginComponent },
  
  { path: 'profile', component: ProfileComponent },

  // Admin routes: localhost:4200/admin/...
  
    { path: 'admin', component: AdminHomeComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  // { path: 'admin/add-bill', component:  },
  { path: 'admin/register', component: RegisterComponent },
  { path: 'admin/bills', component: AdminBillsComponent  }, // view-bills
  { path: 'admin/complaints', component: AdminComplaintsComponent },
  { path: 'admin/complaints/:id', component: AdminComplaintSummaryComponent },
  { path: 'admin/register-sme', component: RegisterSmeComponent},
    { path: 'admin/add-bill', component: AdminAddBillComponent },
    { path: 'admin/view-bill', component: AdminViewBillComponent },
    { path: 'admin/list-customer', component: CustomerListComponent },

  // { path: 'admin/add-bill', component: AdminAddBillComponent },
  //   { path: 'admin/view-bill', component: AdminViewBillComponent }

  // SME routes: localhost:4200/sme/...
  { path: 'sme', component: SmeHomeComponent  },
  { path: 'sme/users', component: SmeUsersComponent },
  { path: 'sme/complaints', component: SmeComplaintsComponent},
  { path: 'admin/smes', component: ListSmeComponent },

  // Fallback (consider redirecting to a meaningful page or a 404 component)
  { path: '**', redirectTo: '' },

];
