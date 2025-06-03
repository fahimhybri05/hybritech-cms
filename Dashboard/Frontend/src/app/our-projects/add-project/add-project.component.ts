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
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

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
  selectedFiles: File[] = [];
  selectedFilesUrl: {name: string, url: string}[] = [];
  isActive: boolean = true;
  MAX_FILES = 5; // Maximum allowed images

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
    this.isActive = $event.target.checked;
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      if (files.length > this.MAX_FILES) {
        this.fileTypeError = `Maximum ${this.MAX_FILES} images allowed`;
        event.target.value = ''; 
        return;
      }

      this.fileTypeError = null;
      this.selectedFiles = [];
      this.selectedFilesUrl = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
        
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(fileType)) {
          this.fileTypeError = 'Only JPG, JPEG, PNG and GIF formats are allowed.';
          continue;
        }
        
        if (file.size > 2 * 1024 * 1024) {
          this.fileTypeError = 'File size should not exceed 2MB.';
          continue;
        }
        
        this.selectedFiles.push(file);
        
        // Create preview URLs
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFilesUrl.push({
            name: file.name,
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(fileName: string) {
    this.selectedFilesUrl = this.selectedFilesUrl.filter(file => file.name !== fileName);
    this.selectedFiles = this.selectedFiles.filter(file => file.name !== fileName);
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }

  insertData() {
    if (!this.title || !this.subtitle || !this.description) {
      this.errorMessage = 'Title, Subtitle and Description are required.';
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
    this.commonService.post('projects', formData, false).subscribe(
      (response: any) => {
        this.loading = false;
        this.isSuccess = true;
        
        if (response?.media?.length > 0) {
          response.media.forEach((mediaItem: any) => {
            console.log('Uploaded image:', mediaItem.original_url);
          });
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
    this.fileTypeError = null;
    this.title = '';
    this.subtitle = '';
    this.description = '';
    this.selectedFiles = [];
    this.selectedFilesUrl = [];
  }
}