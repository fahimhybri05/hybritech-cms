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
  faq: any = {};
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
    console.log('Changes detected:', changes);
    if (changes['isOpen']?.currentValue === true) {
      if (this.jobData) {
        this.loadJobData();
      } else if (this.jobId) {
        this.getJobInfo();
      }
    }
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
          this.sucessMessage = 'Job updated successfully';
          this.closeDialog();
        },
        error: (error: any) => {
          this.formloading = false;
          this.isEditError = true;
          this.errorMessage = error.error?.message || 'Error updating FAQ';
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
