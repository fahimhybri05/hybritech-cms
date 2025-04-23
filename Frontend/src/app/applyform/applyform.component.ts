import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
export class ApplyformComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<FormData>();
  @Input() jobData: any = {};
  @Input() jobId: number | null = null;
  @Input() jobTitles: any[] = [];

  designations: any[] = [];
  selectedDesignation: string = '';
  [x: string]: any;
  is_active = 0;
  full_name: string = '';
  email: string = '';
  number: string = '';
  designation: string = '';
  experience: string = '';
  attachment: any = null;
  isLoading: boolean = false;
  constructor(
    private dataService: DataService,
    private swalService: SwalService
  ) {}
  closeModal() {
    this.isOpen = false;
    this.closed.emit();
  }
  ngOnInit() {
    if (this.jobData) {
      this.selectedDesignation = this.jobData.title;
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.attachment = event.target.files[0];
    }
  }
  insertJobData() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('full_name', this.full_name);
    formData.append('email', this.email);
    formData.append('is_active', this.is_active.toString());
    formData.append('designation', this.selectedDesignation);
    formData.append('experience', this.experience);
    formData.append('number', this.number.toString());
    formData.append('attachment', this.attachment);
    console.log('hello', formData);
    this.dataService.insertApplication(formData).subscribe({
      next: () => {
        this.swalService.showSuccess(
          'Application submitted successfully. We will contact with you soon.'
        );
        this.closeModal();
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        this.swalService.showError('There was an error submitting the form');
        this.isLoading = false;
      },
    });
  }
  private resetForm() {
    this.full_name = '';
    this.email = '';
    this.number = '';
    this.selectedDesignation = '';
    this.experience = '';
    this.attachment = null;
  }
}
