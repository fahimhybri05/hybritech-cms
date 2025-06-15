import { Component, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQComponent } from '@app/components/faq/faq.component';
import { FormComponent } from '@app/components/form/form.component';
import { DataService } from '@app/services/data.service';
import { ApplyformComponent } from '@app/applyform/applyform.component';
import { SwalService } from '@app/services/shared/swal.service';
@Component({
  selector: 'app-career-page',
  standalone: true,
  imports: [FAQComponent, FormComponent, CommonModule, ApplyformComponent],
  templateUrl: './career-page.component.html',
  styleUrl: './career-page.component.css',
})
export class CareerPageComponent {
  @Input() submitted = new EventEmitter<FormData>();
  jobs: any[] = [];
  isOpen = false;
  activeIndex: number | null = -1;
  showApplyModal = false;
  selectedJobId: number | null = null;
  selectedJobData: any = null;
  constructor(
    private dataService: DataService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.activeIndex = -1;
    this.getJobs();
  }

  getJobs() {
    this.dataService.getJobPostData().subscribe(
      (response) => {
        this.jobs = response?.value || [];
        this.selectedJobId = response.id;
        this.selectedJobData = response;
      },
      (error) => {
        this.swalService.showError('There was an error submitting the form');
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

  openModal() {
    this.isOpen = true;
  }

  onModalClosed() {
    this.isOpen = false;
  }
}
