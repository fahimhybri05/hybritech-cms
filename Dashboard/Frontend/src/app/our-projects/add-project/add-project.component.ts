import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BusyIndicatorComponent,
  InputComponent,
  LabelComponent,
} from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { CommonService } from 'app/services/common-service/common.service';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputComponent,
    BusyIndicatorComponent,
    AngularEditorModule,
    TextAreaComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  placeholder = 'Enter text here...';
  title: string = '';
  subtitle: string = '';
  description: string = '';
  selectedFiles: File[] = [];
  selectedFilesUrl: { name: string; url: string }[] = [];
  isActive: boolean = true;
  MAX_FILES = 5;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    width: '100%',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  constructor(private commonService: CommonService) {}

  toggleActive($event: any) {
    this.isActive = $event.target.checked;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    if (this.selectedFiles.length + files.length > this.MAX_FILES) {
      this.fileTypeError = `Maximum ${this.MAX_FILES} images allowed`;
      input.value = '';
      return;
    }

    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        this.fileTypeError = 'File size should not exceed 2MB.';
        input.value = '';
        return;
      }
      this.selectedFiles.push(file);
      this.selectedFilesUrl.push({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
    this.fileTypeError = null;
    input.value = '';
  }

  removeImage(fileName: string) {
    const fileToRemove = this.selectedFilesUrl.find(
      (file) => file.name === fileName
    );
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    this.selectedFilesUrl = this.selectedFilesUrl.filter(
      (file) => file.name !== fileName
    );
    this.selectedFiles = this.selectedFiles.filter(
      (file) => file.name !== fileName
    );
  }

  clearErrorMessage(event: Event) {
    event.stopPropagation();
    this.errorMessage = '';
  }

  clearFileTypeError(event: Event) {
    event.stopPropagation();
    this.fileTypeError = null;
  }

  insertData() {
    if (
      !this.title ||
      !this.subtitle ||
      !this.description ||
      !this.selectedFilesUrl.length
    ) {
      this.errorMessage =
        'Title, Subtitle, Description, and Images are required.';
      return;
    }
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please upload at least one image.';
      return;
    }
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('subtitle', this.subtitle);
    formData.append('description', this.description);
    formData.append('is_active', this.isActive ? '1' : '0');

    this.selectedFiles.forEach((file, index) => {
      formData.append('images[]', file, file.name);
    });

    this.loading = true;
    this.commonService.post('projects', formData, false).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.ToastType = 'add';
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.closeDialog();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'An error occurred while submitting the data.';
        console.error(error);
      },
    });
  }

  closeDialog() {
    this.isOpen = false;
    this.resetForm();
    this.close.emit();
  }

  resetForm() {
    this.errorMessage = '';
    this.fileTypeError = null;
    this.title = '';
    this.subtitle = '';
    this.description = '';
    this.selectedFilesUrl.forEach((file) => URL.revokeObjectURL(file.url));
    this.selectedFiles = [];
    this.selectedFilesUrl = [];
    this.isActive = true;
  }
}
