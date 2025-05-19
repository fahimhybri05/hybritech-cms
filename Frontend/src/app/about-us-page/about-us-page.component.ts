import { Component } from '@angular/core';
import { FormComponent } from '../components/form/form.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '@app/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [FormComponent, CommonModule],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css',
})
export class AboutUsPageComponent {
  projects: any[] = [];
  pages: any[] = [];
  isActive = false;
  constructor(
    private sanitizer: DomSanitizer,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getProjectData();
    this.getWebpageData();
  }

  getProjectData() {
    this.dataService.getProjectData().subscribe(
      (response) => {
        this.projects = Array.isArray(response) ? response : [];
      },
      (error) => {
        console.error('Error fetching services:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }
  getSanitizedIcon(icon: string) {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
  getWebpageData() {
    this.dataService.getWebPageData().subscribe(
      (response) => {
        this.isActive = response.value[0].is_active;
      },
      (error) => {
        console.error('Error fetching services:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }
}
