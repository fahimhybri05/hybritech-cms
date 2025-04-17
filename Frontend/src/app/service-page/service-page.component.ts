import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQComponent } from '../components/faq/faq.component';
import { FormComponent } from '../components/form/form.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-service-page',
  standalone: true,
  imports: [FAQComponent, FormComponent, CommonModule],
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.css',
})
export class ServicePageComponent {
  services: any[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getServiceData();
  }

  getServiceData() {
    this.dataService.getServiceData().subscribe(
      (response) => {
        console.log('Raw API response:', response);
        this.services = Array.isArray(response) ? response : [];
        console.log('Processed services:', this.services);
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
}
