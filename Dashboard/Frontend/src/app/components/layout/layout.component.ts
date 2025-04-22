import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '@app/components/side-bar/side-bar.component';
import {
  AvatarComponent,
  BarComponent,
  PopoverComponent,
} from '@ui5/webcomponents-ngx';

@Component({
  selector: 'app-layout',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    SidebarComponent,
    PopoverComponent,
    BarComponent,
    AvatarComponent,
    CommonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  user: User | null = null;
  errorMessage = '';
  successMessage = '';
  loading = false;
  isCollapsed: boolean = false;
  popoverOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (!this.user && this.authService.isLoggedIn()) {
      this.authService.fetchUser().subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('Failed to fetch user:', error);
          this.errorMessage = 'Failed to load user data';
        },
      });
    }
    this.authService.getUserObservable().subscribe((user) => {
      this.user = user;
    });
  }

  toggleSidenav(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onLogout(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        this.successMessage = 'Logged out successfully!';
        this.loading = false;
        this.router
          .navigate(['/login'])
          .then((success) => {
            console.log('Navigation to login successful:', success);
          })
          .catch((error) => {
            console.error('Navigation to login failed:', error);
          });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.loading = false;
        this.errorMessage = error.error.message || 'Logout failed';
      },
    });
  }

  togglePopover(): void {
    this.popoverOpen = !this.popoverOpen;
  }
}
