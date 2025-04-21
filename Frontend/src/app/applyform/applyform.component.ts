import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { SwalService } from '@app/services/shared/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-applyform',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './applyform.component.html',
  styleUrl: './applyform.component.css',
})
export class ApplyformComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<FormData>();
  [x: string]: any;
  is_active = 0;
  full_name: string = '';
  email: string = '';
  number: string = '';
  designation: string = '';
  experience: string = '';
  attachment: any = null;
  constructor(
    private dataService: DataService,
    private swalService: SwalService
  ) {}
  closeModal() {
    this.isOpen = false;
    this.closed.emit();
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.attachment = event.target.files[0];
    }
  }
  insertJobData() {
    const formData = new FormData();
    formData.append('full_name', this.full_name);
    formData.append('email', this.email);
    formData.append('is_active', this.is_active.toString());
    formData.append('designation', this.designation);
    formData.append('experience', this.experience);
    formData.append('number', this.number.toString());
    formData.append('attachment', this.attachment);
    console.log('hello', formData);
    this.dataService.insertApplication(formData).subscribe({
      next: () =>{
        this.swalService.showSuccess(
          'Application submitted successfully. We will contact with you soon.'
    
        );
        this.closeModal();
        this.resetForm();
      },
      error: (error) => {
        this.swalService.showError('There was an error submitting the form');
        console.log(error);
      },
    });
  }
  private resetForm() {
    this.full_name = '';
    this.email = '';
    this.number = '';
    this.designation = '';
    this.experience = '';
    this.attachment = null;
  }
}
