import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from 'app/components/form-preloader/form-preloader.component';
import { CommonService } from 'app/services/common-service/common.service';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import {AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputComponent,
    AngularEditorModule,
    FormPreloaderComponent,
    TextAreaComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  placeholder = '';
  htmlContent: string = '';
  title: string = '';
  subtitle: string = '';
  description: string = '';
  wordCount: number = 0;
  maxWords: number = 45;
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  isActive: boolean = true;
  editorConfig: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '20rem',
      width: '80rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
    };
  constructor(private commonService: CommonService) {}
  toggleActive($event: any) {
    if ($event.target.checked) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
          fileType
        )
      ) {
        this.fileTypeError = 'Only JPG, JPEG, PNG and GIF formats are allowed.';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.fileTypeError = 'File size should not exceed 2MB.';
        return;
      }
      this.fileTypeError = null;
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  updateWordCount() {
    if (!this.description) {
      this.wordCount = 0;
      return;
    }
    this.wordCount = this.description.trim().split(/\s+/).length;
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
  insertData() {
    if (!this.title || !this.subtitle  || !this.selectedFile) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (this.wordCount > this.maxWords) {
      this.errorMessage = `Description cannot exceed ${this.maxWords} words.`;
      return;
    }
 
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('subtitle', this.subtitle);
    formData.append('description', this.htmlContent);
    formData.append('is_active', this.isActive ? '1' : '0');
    formData.append('image', this.selectedFile);
    this.loading = true;
    this.commonService.post('projects', formData, false).subscribe(
      (response: any) => {
        console.log(response);
        this.loading = false;
        this.isSuccess = true;
        if (response && response.media && response.media.length > 0) {
          const mediaUrl = response.media[0].original_url;
        }
        this.ToastType = 'add';
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.resetForm();
        this.closeDialog();
      },
      (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'An error occurred while submitting the data.';
        console.error(error);
      }
    );
  }
  resetForm() {
    this.errorMessage = '';
    this.title = '';
    this.subtitle = '';
    this.description = '';
    this.selectedFile = null;
  }
}
