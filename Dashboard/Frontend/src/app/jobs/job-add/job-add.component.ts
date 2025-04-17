import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { LabelComponent, TextAreaComponent } from '@ui5/webcomponents-ngx';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { Joblist } from '@app/shared/Model/joblist';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
@Component({
  selector: 'app-job-add',
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
  templateUrl: './job-add.component.html',
  styleUrl: './job-add.component.css',
})
export class JobAddComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  isAddError: boolean = false;

  errorMessage: string = '';
  headerDescription: string = '';
  title: string = '';
  htmlContent: string = '';
  placeholder = '';
  isActive: boolean = true;
  joblist: Joblist = new Joblist().deserialize({});

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
    private router: Router,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {}

  toggleActive($event: any) {
    if ($event.target.checked) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }
  insertData() {
    if (!this.headerDescription || !this.title) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const data = {
      title: this.title,
      header_description: this.headerDescription,
      job_description: this.htmlContent,
      is_active: this.isActive,
    };

    this.loading = true;
    this.commonService.post('JobLists', data).subscribe(
      (response: any) => {
        console.log(response);
        this.loading = false;
        this.isSuccess = true;
             this.ToastType = 'add';
             setTimeout(() => {
               this.IsOpenToastAlert.emit();
             }, 1000);
        this.resetForm();
        this.closeDialog();
      },
      (error: any) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while submitting the data.';
        console.error(error);
      }
    );
  }
  rersetForm() {
    this.errorMessage = '';
    this.title = '';
    this.headerDescription = '';
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }

  resetForm() {
    this.headerDescription = '';
    this.title = '';
    this.htmlContent = '';
    this.isActive = true;
  }
}
