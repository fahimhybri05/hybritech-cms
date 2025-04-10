import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQComponent } from '../components/faq/faq.component';
import { FormComponent } from '../components/form/form.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-career-page',
  standalone: true,
  imports: [FAQComponent, FormComponent, CommonModule],
  templateUrl: './career-page.component.html',
  styleUrl: './career-page.component.css',
})
export class CareerPageComponent {
  jobs: any[] = [];

  activeIndex: number | null = -1;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.activeIndex = -1;
    this.getJobs();
  }

  getJobs() {
    this.dataService.getJobPostData().subscribe(
      (response) => {
        this.jobs = response?.value || [];
      },
      (error) => {
        console.error('Error fetching job posts:', error);
      }
    );
  }

  toggleJob(index: number): void {
    if (this.activeIndex === index) {
      this.activeIndex = -1;
    } else {
      this.activeIndex = index;
    }
  }
}
