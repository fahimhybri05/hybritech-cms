import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { SwalService } from '../services/shared/swal.service'; 

@Component({
  selector: 'app-contact-us-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us-page.component.html',
  styleUrls: ['./contact-us-page.component.css'],
})
export class ContactUsPageComponent {
  fullName: string = '';
  email: string = '';
  subject: string = '';
  number: string = '';
  description: string = '';

  constructor(
    private dataService: DataService,
    private swalService: SwalService 
  ) {}


  insertFormData() {

    if (!this.fullName || !this.email || !this.number || !this.subject || !this.description) {
      this.swalService.showError('Please fill all fields correctly.');
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
      is_read: false,
      description: this.description,
    };

    this.dataService.insertCotactForm(formData).subscribe({
      next: (data) => {
        this.swalService.showSuccess('Form submitted successfully. We will contact with you soon.');
        this.resetForm();
      },
      error: (error) => {
        console.log(error);
        this.swalService.showError('There was an error submitting the form');
      },
    });
  }
  private resetForm() {
    this.fullName = this.email = this.subject = this.description = 
    this.number  = '';
  }
}
