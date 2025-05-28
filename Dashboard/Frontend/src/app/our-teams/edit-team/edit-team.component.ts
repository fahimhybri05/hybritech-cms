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
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { CommonService } from '@app/services/common-service/common.service';
import { InputComponent, LabelComponent, TextAreaComponent } from '@ui5/webcomponents-ngx';

@Component({
  selector: 'app-edit-team',
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
  templateUrl: './edit-team.component.html',
  styleUrl: './edit-team.component.css'
})
export class EditTeamComponent {
 @Input() isOpen: boolean | null = null;
  @Input() teamId: number | null = null;
  @Input() teamData: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  @Output() refreshTable = new EventEmitter();
  ToastType: string = '';
  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';
  fileTypeError: string | null = null;
  name: string = '';
  designation: string = '';
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  currentImageUrl: string | null = null;
  isActive: boolean = true;
  constructor(private commonService: CommonService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teamData'] && this.teamData) {
      this.name = this.teamData.name || '';
      this.designation = this.teamData.designation || '';
      this.isActive = this.teamData.is_active;
      if (this.teamData.media) {
        this.currentImageUrl = this.teamData.media[0].original_url;
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

  updateData() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('designation', this.designation);
    formData.append('is_active', this.isActive ? '1' : '0');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('_method', 'put');
    this.loading = true;
    this.commonService
      .post(`teams/${this.teamId}`, formData, false)
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
