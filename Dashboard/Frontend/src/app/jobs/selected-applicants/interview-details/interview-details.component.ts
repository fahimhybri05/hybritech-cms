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
  selector: 'app-interview-details',
  standalone: true,
  imports: [CommonModule, ToastMessageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './interview-details.component.html',
  styleUrl: './interview-details.component.css'
})
export class InterviewDetailsComponent {
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
  api: boolean;
  cdr: any;
    constructor(private commonservice: CommonService) {
    this.api = this.commonservice.api;
  }

  ngOnInit(): void {
  }

  updateStatus() {
    if (
      !this.jobApplicantData ||
      !this.jobApplicantData.id
    ) {
      return;
    }

  const data = {
    id: this.jobApplicantData.id,
    is_email_sent: true,
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
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
