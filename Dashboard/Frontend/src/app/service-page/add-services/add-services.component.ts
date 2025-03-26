import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from 'app/components/form-preloader/form-preloader.component';
import { CommonService } from 'app/services/common-service/common.service';


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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-services.component.html',
  styleUrl: './add-services.component.css'
})
export class AddServicesComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();

  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  title: string = '';
  description: string = '';
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;

  constructor(private commonService: CommonService) {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType !== 'image/svg+xml' && fileType !== 'image/png') {
        this.fileTypeError = 'Only SVG and PNG formats are allowed.';
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

  insertData() {
    if ( !this.title || !this.description || !this.selectedFile) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('image', this.selectedFile);

    this.loading = true;
    this.commonService.post('service-pages', formData, false).subscribe(
      (response) => {
        console.log(response);
        this.loading = false;
        this.isSuccess = true;
        this.resetForm();
        this.closeDialog();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'An error occurred while submitting the data.';
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
