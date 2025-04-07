import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-details',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './form.details.component.html',
  styleUrl: './form.details.component.css',
})
export class FormDetailsComponent implements OnInit {
  @Input() formId: number | null = null;
  @Input() formData: any = {};  // Form data passed from parent
  @Input() isOpen: boolean = false;  // Modal open state passed from parent
  @Output() close: EventEmitter<void> = new EventEmitter<void>();  // Event to close the modal

  question: string = "";
  answer: string = "";

  ngOnInit(): void {
    if (this.formData) {
      this.question = this.formData.full_name;
      this.answer = this.formData.email;  // Bind to relevant fields
    }
  }

  closeDialog() {
    this.close.emit();  
  }
}
