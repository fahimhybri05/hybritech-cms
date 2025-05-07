import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { SwalService } from '../../services/shared/swal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
[x: string]: any;
  name: string = '';
  email: string = '';
  projectName: string = '';
  projectDescription: string = '';
  projectType: string = '';
  projectBudget: any = '';
  isSubmitting: boolean = false;
  constructor(private dataService: DataService, private swalService: SwalService) {}

  private emailExists(email: string): boolean {
    return ['test@example.com', 'demo@example.com'].includes(email);
  }

  insertFormData() {
    this.isSubmitting = true;
    if (!this.name || !this.email || !this.projectName || !this.projectType || 
        !this.projectBudget || !this.projectDescription) {
      this.swalService.showError('Please fill all fields correctly.');
      this.isSubmitting = false;
      return;
    }

    if (!this.email.includes('@')) {
      this.swalService.showError('Email must be valid.');
      return;
    }

    if (this.emailExists(this.email)) {
      this.swalService.showError('Email already exists. Please use a different email address.');
      return;
    }

    if (isNaN(this.projectBudget)) {
      this.swalService.showError('Project Budget must be numeric.');
      return;
    }

    const formData = {
      full_name: this.name,
      email: this.email,
      is_active : false,
      project_name: this.projectName,
      description: this.projectDescription,
      project_type: this.projectType,
      project_budget: this.projectBudget.toString()
    };

    this.dataService.insertCommonForm(formData).subscribe({
      next: (data) =>{
       this.swalService.showSuccess('Form submitted successfully. We will contact with you soon.');
       this.resetForm();
       this.isSubmitting = false;
      },
      error: (error) => {
        this.swalService.showError('There was an error submitting the form');
        console.log(error);
        this.isSubmitting = false;
      }
    });
  }

  private resetForm() {
    this.name = this.email = this.projectName = this.projectDescription = 
    this.projectType = this.projectBudget = '';
 
  }
}
