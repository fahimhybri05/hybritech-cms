import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterEvent,
  RouterOutlet,
} from '@angular/router';
import { LayoutComponent } from '@app/components/layout/layout.component';
import { AuthLayoutComponent } from '@app/components/auth-layout/auth-layout.component';
import { filter } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, AuthLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  showAuthLayout = false;
  title = 'dashboard-frontend';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check initial login state
    this.isLoggedIn = this.authService.isLoggedIn();

    // Subscribe to route changes to determine layout
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Show auth layout for login and register routes
        this.showAuthLayout = ['/login', '/register'].includes(
          event.urlAfterRedirects
        );
        // Update login state on navigation
        this.isLoggedIn = this.authService.isLoggedIn();
      });
  }
}
