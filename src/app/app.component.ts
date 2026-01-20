import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UI';
  showNavbar = true;
  showFooter = true;
  // Routes on which the navbar should be hidden
  private hideOnRoutes = ['/login', '/register'];
  private hideOnFooter = ['/login', '/register','/admin/complaints'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        // Ignore query params/fragments for the check
        const url = this.router.url.split('?')[0].split('#')[0];
        this.showNavbar = !this.hideOnRoutes.some(r => url.startsWith(r));
        this.showFooter = !this.hideOnFooter.some(r => url.startsWith(r))
      });
  }

}
