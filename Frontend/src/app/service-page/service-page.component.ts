import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQComponent } from '@app/components/faq/faq.component';
import { FormComponent } from '@app/components/form/form.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '@app/services/data.service';

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
        this.services = Array.isArray(response) ? response : [];
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
