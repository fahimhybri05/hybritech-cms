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

@Component({
  selector: 'app-add-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputComponent,
    FormPreloaderComponent,
    TextAreaComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-services.component.html',
  styleUrl: './add-services.component.css',
})
export class AddServicesComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  title: string = '';
  description: string = '';
  wordCount: number = 0;
  titlewordcount: number = 0;
  maxtitlewords: number = 25;
  maxWords: number = 60;
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;

  constructor(private commonService: CommonService) {}

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
  updateTitleWordCount() {
    if (!this.title) {
      this.titlewordcount = 0;
      return;
    }
    this.titlewordcount = this.title.trim().split(/\s+/).length;
  }

  insertData() {
    if (!this.title || !this.description || !this.selectedFile) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (this.wordCount > this.maxWords) {
      this.errorMessage = `Description cannot exceed ${this.maxWords} words.`;
      return;
    }
    if(this.titlewordcount > this.maxtitlewords){
      this.errorMessage = `Title cannot exceed ${this.maxtitlewords} words.`;
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('image', this.selectedFile);
    this.loading = true;
    this.commonService.post('service-pages', formData, false).subscribe(
      (response: any) => {
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
    this.description = '';
    this.selectedFile = null;
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
