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
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { CommonService } from '@app/services/common-service/common.service';
import { FormPreloaderComponent } from 'app/components/form-preloader/form-preloader.component';

@Component({
  selector: 'app-add-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    InputComponent,
    TextAreaComponent,
    FormPreloaderComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.css',
})
export class AddTeamComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  name: string = '';
  designation: string = '';
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  isActive: boolean = true;

  constructor(private commonService: CommonService) {}

  toggleActive($event: any) {
    this.isActive = $event.target.checked;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file) {
      const fileType = file.type;
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ];
      if (!validTypes.includes(fileType)) {
        this.fileTypeError = 'Only JPG, PNG, GIF, and SVG formats are allowed.';
        input.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.fileTypeError = 'File size should not exceed 2MB.';
        input.value = '';
        return;
      }
      this.fileTypeError = null;
      this.selectedFile = file;
      this.selectedFileUrl = URL.createObjectURL(file);
      input.value = '';
    }
  }

  clearSelectedImage() {
    if (this.selectedFileUrl) {
      URL.revokeObjectURL(this.selectedFileUrl);
    }
    this.selectedFile = null;
    this.selectedFileUrl = null;
  }

  insertData() {
    if (!this.name || !this.designation || !this.selectedFile) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('designation', this.designation);
    formData.append('is_active', this.isActive ? '1' : '0');
    formData.append('image', this.selectedFile!);
    this.loading = true;
    this.commonService.post('teams', formData, false).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isSuccess = true;
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

  clearErrorMessage(event: Event) {
    event.stopPropagation();
    this.errorMessage = '';
  }

  clearFileTypeError(event: Event) {
    event.stopPropagation();
    this.fileTypeError = null;
  }

  resetForm() {
    this.errorMessage = '';
    this.fileTypeError = null;
    this.name = '';
    this.designation = '';
    if (this.selectedFileUrl) {
      URL.revokeObjectURL(this.selectedFileUrl);
    }
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.isActive = true;
  }
}
