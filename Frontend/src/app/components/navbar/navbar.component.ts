import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isDarkTheme = false;
  isScrolled = false;
  isContactPage = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isContactPage =
          event.urlAfterRedirects === '/contact' ||
          event.urlAfterRedirects.startsWith('/contact/');
        if (this.isContactPage) {
          this.isScrolled = true;
        }
      }
    });
  }
  ngOnInit(): void {
    this.isContactPage =
      this.router.url === '/contact' || this.router.url.startsWith('/contact/');
    if (this.isContactPage) {
      this.isScrolled = true;
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isDarkTheme = checked;

    if (checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isContactPage) {
      const scrollPosition =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      this.isScrolled = scrollPosition > 50;
    }
  }
}
