import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '@ui5/webcomponents-ngx';
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
  
  title: string = '';
  description: string = '';
  selectedFile: File | null = null;

  constructor(private commonService: CommonService) {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  insertData() {
    if (!this.title || !this.description || !this.selectedFile) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('header', this.description);
    formData.append('image', this.selectedFile);

    this.loading = true;
    this.commonService.post('media', formData, false).subscribe(
      (response) => {
        console.log(response);
        this.loading = false;
        this.isSuccess = true;
        this.resetForm();
        this.closeDialog();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while submitting the data.';
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
