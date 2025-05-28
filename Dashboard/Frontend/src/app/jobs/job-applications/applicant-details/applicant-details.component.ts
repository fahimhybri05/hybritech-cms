import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonService } from '@app/services/common-service/common.service';
import { JobApplication } from '@app/shared/Model/jobapplication';
import { environment } from '@env/environment';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
@Component({
  selector: 'app-applicant-details',
  standalone: true,
  imports: [CommonModule, ToastMessageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './applicant-details.component.html',
  styleUrl: './applicant-details.component.css',
})
export class ApplicantDetailsComponent implements OnInit {
  @Input() jobApplicantId: number | null = null;
  @Input() jobApplicantData: JobApplication | null = null;
  @Input() isOpen: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() updated: EventEmitter<JobApplication> =
    new EventEmitter<JobApplication>();
  @Output() refreshTable = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  formloading: boolean = false;
  is_selected: boolean = false;
  api: boolean;
  cdr: any;

  constructor(private commonservice: CommonService) {
    this.api = this.commonservice.api;
  }

  ngOnInit(): void {}

  downloadResume() {
    const url = environment.ServerApi + '/api/job-applications/';

    window.open(url + this.jobApplicantId + '/attachment', '_blank');
  }
  updateStatus() {
    if (
      !this.jobApplicantData ||
      !this.jobApplicantData.id
    ) {
      return;
    }
  const formatDateForBackend = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const data = {
    id: this.jobApplicantData.id,
    is_active: true,
    is_selected: this.is_selected,
    selected_at: this.is_selected ? formatDateForBackend(new Date()) : null
  };
    this.commonservice
      .patch(`job-applications/${this.jobApplicantId}`, data, this.api)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.ToastType = 'select';
          setTimeout(() => {
            this.IsOpenToastAlert.emit();
          }, 1000);
          this.closeDialog();
          this.refreshTable.emit();
        },
        error: (error: any) => {
          console.log('Error updating form:', error);
        },
      });
  }
  toggleActive($event: any) {
    this.is_selected = $event.target.checked;
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
