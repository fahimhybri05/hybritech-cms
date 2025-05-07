import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { SwalService } from '../services/shared/swal.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact-us-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us-page.component.html',
  styleUrls: ['./contact-us-page.component.css'],
})
export class ContactUsPageComponent {
  fullName: string = '';
  email: string = '';
  subject: string = '';
  number: string = '';
  description: string = '';
  isSubmitting: boolean = false;
  info: any = {};
  constructor(
    private dataService: DataService,
    private swalService: SwalService
  ) {}
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.dataService.getAddressData().subscribe(
      (response) => {
        this.info = response?.value?.[0] || {};
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  insertFormData() {
    this.isSubmitting = true;
    if (
      !this.fullName ||
      !this.email ||
      !this.number ||
      !this.subject ||
      !this.description
    ) {
      this.swalService.showError('Please fill all fields correctly.');
      this.isSubmitting = false;
      return;
    }

    if (!this.email.includes('@')) {
      this.swalService.showError('Email must be valid.');
      return;
    }

    if (isNaN(Number(this.number))) {
      this.swalService.showError('Phone number must be numeric.');
      return;
    }

    const formData = {
      full_name: this.fullName,
      email: this.email,
      subject: this.subject,
      number: this.number,
      is_active: false,
      description: this.description,
    };

    this.dataService.insertCotactForm(formData).subscribe({
      next: (data) => {
        this.swalService.showSuccess(
          'Form submitted successfully. We will contact with you soon.'
        );
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.log(error);
        this.swalService.showError('There was an error submitting the form');
        this.isSubmitting = false;
      },
    });
  }
  private resetForm() {
    this.fullName =
      this.email =
      this.subject =
      this.description =
      this.number =
        '';
  }
}
