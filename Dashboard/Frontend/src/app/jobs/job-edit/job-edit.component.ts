import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  SimpleChanges,
  Input,
  Output,
} from '@angular/core';
import { CommonService } from '@app/services/common-service/common.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { LabelComponent, TextAreaComponent } from '@ui5/webcomponents-ngx';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
@Component({
  selector: 'app-job-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    LabelComponent,
    FormPreloaderComponent,
    TextAreaComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './job-edit.component.html',
  styleUrl: './job-edit.component.css',
})
export class JobEditComponent {
  @Input() isOpen: boolean | null = null;
  @Input() jobId: number | null = null;
  @Input() jobData: any = {};
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  isSuccess: boolean = false;
  isEditError: boolean = false;
  sucessMessage: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  formloading: boolean = false;
  isActive: boolean = false;
  title: string = '';
  headerDescription: string = '';
  jobDescription: string = '';
  odata: boolean;
  wordCount: number = 0;
  headerwordCount: number = 0;
  maxWords: number = 20;
  maxHeaderWords: number = 100;
  api: boolean;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
  }
  ngOnInit(): void {
    if (this.jobData) {
      this.title = this.jobData.title;
      this.headerDescription = this.jobData.headerDescription;
      this.jobDescription = this.jobData.jobDescription;
      this.loadJobData();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      if (this.jobData) {
        this.loadJobData();
      } else if (this.jobId) {
        this.getJobInfo();
      }
    }
  }

  updatetitleWordCount() {
    if (!this.title) {
      this.wordCount = 0;
      return;
    }
    this.wordCount = this.title.trim().split(/\s+/).length;
  }
  updateHeaderWordCount() {
    if (!this.headerDescription) {
      this.headerwordCount = 0;
      return;
    }
    this.headerwordCount = this.headerDescription.trim().split(/\s+/).length;
  }
  loadJobData(): void {
    this.title = this.jobData.title || '';
    this.headerDescription = this.jobData.header_description || '';
    this.jobDescription = this.jobData.job_description || '';
    this.isActive = this.jobData.is_active === true;
  }

  getJobInfo(): void {
    if (!this.jobId) return;

    this.loading = true;
    this.commonService.get(`JobLists/${this.jobId}`).subscribe({
      next: (response: any) => {
        this.jobData = response;
        this.loadJobData();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }
  updateJob() {
    if (this.wordCount > this.maxWords) {
      this.errorMessage = `title cannot exceed ${this.maxWords} words.`;
      return;
    }
    if (this.headerwordCount > this.maxHeaderWords) {
      this.errorMessage = `Header description cannot exceed ${this.maxHeaderWords} words.`;
      return;
    }
    const formData = {
      title: this.title,
      header_description: this.headerDescription,
      job_description: this.jobDescription,
      is_active: this.isActive ? true : false,
    };

    this.formloading = true;
    this.commonService
      .put(`JobLists(${this.jobId!})`, formData, true)
      .subscribe({
        next: (response: any) => {
          this.formloading = false;
          this.isSuccess = true;
          this.ToastType = 'edit';
          setTimeout(() => {
            this.IsOpenToastAlert.emit();
          }, 1000);
          this.closeDialog();
        },
        error: (error: any) => {
          this.formloading = false;
          this.isEditError = true;
          this.errorMessage = error.error?.message || 'Error updating JOB';
        },
      });
  }
  toggleActive($event: any) {
    this.isActive = $event.target.checked;
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
