import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonService } from '@app/services/common-service/common.service';
import { JobApplication } from '@app/shared/Model/jobapplication';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';

@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [CommonModule, ToastMessageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css'],
  providers: [DatePipe],
})
export class InterviewDetailsComponent {
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('designationInput') designationInput!: ElementRef;
  @ViewChild('interviewDatePicker') interviewDatePicker!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;

  @Input() jobApplicantId: number | null = null;
  @Input() jobApplicantData: JobApplication | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<JobApplication>();
  @Output() refreshTable = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  api: boolean;
  formloading: boolean = false;
  isSubmitted: boolean = false;
  constructor(
    private commonservice: CommonService,
    private datePipe: DatePipe
  ) {
    this.api = this.commonservice.api;
  }

  scheduleInterview() {
    if (!this.jobApplicantId || !this.jobApplicantData) {
      return;
    }

    const name = this.nameInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    const designation = this.designationInput.nativeElement.value;
    const interviewDate = this.interviewDatePicker.nativeElement.value;
    const address = this.addressInput.nativeElement.value;

    if (!name || !email || !designation || !interviewDate || !address) {
      return;
    }

    const formattedDate = this.formatDateTime(interviewDate);

    const emailData = {
      application_id: this.jobApplicantId,
      name: name,
      email: email,
      designation: designation,
      address: address,
      interview_date: formattedDate,
    };

    this.formloading = true;

    this.commonservice
      .post('applicant-email-send', emailData, this.api)
      .subscribe({
        next: (response) => {
          this.isSubmitted = true;
          this.closeDialog();
          this.ToastType = 'mail';
          setTimeout(() => {
            this.IsOpenToastAlert.emit();
          }, 1000);
          this.refreshTable.emit();
        },
        error: (error) => {
          console.error('Error scheduling interview:', error);
          this.formloading = false;
        },
      });
  }

  private formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return this.datePipe.transform(dateTime, 'yyyy-MM-dd HH:mm:ss') || '';
  }

  closeDialog() {
    this.isOpen = false;
    this.isSubmitted = false;
    this.close.emit();
  }
}
