import { Component } from '@angular/core';
import { RouterOutlet ,Router, NavigationEnd} from '@angular/router';
import { LayoutComponent } from "./components/layout/layout.component";
import { AuthLayoutComponent } from "./components/auth-layout/auth-layout.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dashboard';
  // rememberToken: string | null = null;
	// isLoggedIn = true;
	// showLoginLayout = false;
	// constructor(
	// 	// private authService: AuthService,
	// 	private router: Router
	// ) {}

	// ngOnInit() {
	// 	// this.authService.isLoggedIn$.subscribe(loggedIn => {
	// 	// 	this.isLoggedIn = loggedIn;
	// 	// });

	// 	// this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
	// 	// 	this.showLoginLayout = this.router.url === "/login";
	// 	// });
	// }
}
