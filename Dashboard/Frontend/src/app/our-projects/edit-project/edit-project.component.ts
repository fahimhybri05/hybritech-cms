import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from 'app/components/form-preloader/form-preloader.component';
import { CommonService } from 'app/services/common-service/common.service';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-project',
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
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnChanges {
  @Input() isOpen: boolean | null = null;
  @Input() projectId: number | null = null;
  @Input() projectData: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  @Output() refreshTable = new EventEmitter();
  ToastType: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  placeholder = 'Enter text here...';
  title: string = '';
  subtitle: string = '';
  description: string = '';
  isActive: boolean = true;
  selectedFiles: File[] = [];
  selectedFilesUrl: { name: string; url: string }[] = [];
  deleteImageIds: number[] = [];
  MAX_FILES: number = 5;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    width: '66rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  constructor(private commonService: CommonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectData'] && this.projectData) {
      this.title = this.projectData.title || '';
      this.subtitle = this.projectData.subtitle || '';
      this.description = this.projectData.description || '';
      this.isActive = this.projectData.is_active || false;
      this.selectedFiles = [];
      this.selectedFilesUrl = [];
      this.deleteImageIds = [];
      this.projectData.media = this.projectData.media || [];
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const totalImages = (this.projectData?.media?.length || 0) - this.deleteImageIds.length + this.selectedFiles.length + files.length;
    if (totalImages > this.MAX_FILES) {
      this.fileTypeError = `Maximum ${this.MAX_FILES} images allowed`;
      input.value = '';
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        this.fileTypeError = 'Only JPG, PNG, GIF, and SVG formats are allowed.';
        input.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.fileTypeError = 'File size should not exceed 2MB.';
        input.value = '';
        return;
      }
      this.selectedFiles.push(file);
      this.selectedFilesUrl.push({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
    this.fileTypeError = null;
    input.value = ''; // Reset input to allow re-uploading same files
  }

  removeExistingImage(mediaId: number) {
    this.deleteImageIds.push(mediaId);
    this.projectData.media = this.projectData.media.filter((media: any) => media.id !== mediaId);
  }

  removeNewImage(fileName: string) {
    const fileToRemove = this.selectedFilesUrl.find(file => file.name === fileName);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url); // Free memory
    }
    this.selectedFilesUrl = this.selectedFilesUrl.filter(file => file.name !== fileName);
    this.selectedFiles = this.selectedFiles.filter(file => file.name !== fileName);
  }

  clearErrorMessage(event: Event) {
    event.stopPropagation();
    this.errorMessage = '';
  }

  clearFileTypeError(event: Event) {
    event.stopPropagation();
    this.fileTypeError = null;
  }

  updateData() {
    if (!this.title || !this.subtitle || !this.description) {
      this.errorMessage = 'Title, Subtitle, and Description are required.';
      return;
    }

    // Calculate total images: remaining existing images + new images
    const remainingExistingImages = this.projectData?.media?.length
      ? Math.max(0, this.projectData.media.length - this.deleteImageIds.length)
      : 0;
    const totalImages = remainingExistingImages + this.selectedFiles.length;

    if (totalImages === 0) {
      this.errorMessage = 'At least one image is required.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('subtitle', this.subtitle);
    formData.append('description', this.description);
    formData.append('is_active', this.isActive ? '1' : '0');
    formData.append('_method', 'PUT');

    this.selectedFiles.forEach((file) => {
      formData.append('images[]', file, file.name);
    });

    this.deleteImageIds.forEach((id, index) => {
      formData.append(`delete_images[${index}]`, id.toString());
    });

    this.loading = true;
    this.commonService.post(`projects/${this.projectId}`, formData, false).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isSuccess = true;
        this.ToastType = 'edit';
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.refreshTable.emit();
        this.closeDialog();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'An error occurred while updating the data.';
        console.error(error);
      }
    });
  }

  toggleActive($event: any) {
    this.isActive = $event.target.checked;
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
    this.selectedFilesUrl.forEach(file => URL.revokeObjectURL(file.url)); // Free memory
    this.selectedFiles = [];
    this.selectedFilesUrl = [];
    this.deleteImageIds = [];
    this.isActive = true;
    this.projectData = { media: [] }; // Reset with empty media array
  }
}