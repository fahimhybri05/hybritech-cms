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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, AuthLayoutComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  showAuthLayout = false;
  title = 'dashboard-frontend';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.showAuthLayout = ['/login', '/register'].includes(
          event.urlAfterRedirects
        );
        this.isLoggedIn = this.authService.isLoggedIn();
      });
  }
}
