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
  styleUrl: './edit-project.component.css',
})
export class EditProjectComponent {
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
  title: string = '';
  subtitle: string = '';
  description: string = '';
  wordCount: number = 0;
  maxWords: number = 45;
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  currentImageUrl: string | null = null;
  isActive: boolean = true;
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
  constructor(private commonService: CommonService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectData'] && this.projectData) {
      this.title = this.projectData.title || '';
      this.subtitle = this.projectData.subtitle || '';
      this.description = this.projectData.description || '';
      this.isActive = this.projectData.is_active;
      // this.updateWordCount();
      if (this.projectData.media) {
        this.currentImageUrl = this.projectData.media[0].original_url;
      } else {
        this.currentImageUrl = null;
      }
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

  // updateWordCount() {
  //   if (!this.description) {
  //     this.wordCount = 0;
  //     return;
  //   }
  //   this.wordCount = this.description.trim().split(/\s+/).length;
  // }

  updateData() {
    if (!this.title || !this.subtitle || !this.description) {
      this.errorMessage = 'Title and description are required.';
      return;
    }

    // if (this.wordCount > this.maxWords) {
    //   this.errorMessage = `Description cannot exceed ${this.maxWords} words.`;
    //   return;
    // }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('subtitle', this.subtitle);
    formData.append('description', this.description);
    formData.append('is_active', this.isActive ? '1' : '0');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('_method', 'put');
    this.loading = true;
    this.commonService
      .post(`projects/${this.projectId}`, formData, false)
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.isSuccess = true;
          this.ToastType = 'edit';
          setTimeout(() => {
            this.IsOpenToastAlert.emit();
          }, 1000);
          this.refreshTable.emit();
          this.closeDialog();
        },
        (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message ||
            'An error occurred while updating the data.';
          console.error(error);
        }
      );
  }
  toggleActive($event: any) {
    this.isActive = $event.target.checked;
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
