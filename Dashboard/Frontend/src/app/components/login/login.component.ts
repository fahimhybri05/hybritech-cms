import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@ui5/webcomponents-ngx';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, InputComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent implements OnInit {
  // user = new User().deserialize({});
  user = [];
  email: string = '';
  passwoerd: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  isLoggedIn: boolean = false;
  isPasswordVisible: boolean = false;
  validationMessage = {
    email: '',
    password: '',
  };

  constructor(
    // private authService: AuthService,
    private router: Router,
    // private rolePermissionService: RolePermissionService
  ) {}

  ngOnInit(): void {
    const rememberToken = localStorage.getItem('remember_token');
    if (rememberToken) {
      this.router.navigate(['']);
    }
  }

  // validateForm(): boolean {
  //   let isValid = true;

  //   if (!this.user.email) {
  //     this.validationMessage.email = 'Please enter the user email.';
  //     isValid = false;
  //   }
  //   if (!this.user.password) {
  //     this.validationMessage.password = 'Please enter the user password.';
  //     isValid = false;
  //   }
  //   return isValid;
  // }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  clearError(field: string) {
    if (field === 'email') this.validationMessage.email = '';
    if (field === 'password') this.validationMessage.password = '';
  }

  onLogin(): void {
  //   if (!this.validateForm()) {
  //     return;
  //   }
  //   this.loading = true;
  //   this.errorMessage = '';
  //   const email = this.user.email || '';
  //   const password = this.user.password || '';
  //   // this.authService.login(email, password).subscribe({
  //     next: (response) => {
  //       this.user = new User().deserialize(response.user);
  //       localStorage.setItem('userInfo', JSON.stringify(this.user));
  //       localStorage.setItem('roles', JSON.stringify(response.roles));
  //       localStorage.setItem('remember_token', response.token);
  //       localStorage.setItem('preferred_language', 'en-US');
  //       this.successMessage = 'Login successful.';
  //       // this.rolePermissionService.setPermissions(response.permissions);
  //       // this.authService.loginCheck();
  //       this.router.navigate(['']);
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.authService.logoutCheck();
  //       this.errorMessage = 'Login failed. Please check your credentials.';
  //       this.loading = false;
  //     },
  //   });
  }
}
