import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { LabelComponent, TextAreaComponent } from '@ui5/webcomponents-ngx';
import { CommonService } from 'app/services/common-service/common.service';

@Component({
  selector: 'app-edit-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    TextAreaComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './edit-faq.component.html',
  styleUrl: './edit-faq.component.css',
})
export class EditFaqComponent implements OnInit, OnChanges {
  @Input() faqId: number | null = null;
  @Input() faqData: any = {};
  @Input() isOpen: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();

  loading: boolean = true;
  errorMessage: string = '';
  formloading: boolean = false;
  ToastType: string = '';
  odata: boolean;
  api: boolean;
  isEditError: boolean = false;
  sucessMessage: string = '';
  faq: any = {};
  answer: string = '';
  question: string = '';

  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
  }

  ngOnInit(): void {
    if (this.faqData) {
      this.question = this.faqData.question;
      this.answer = this.faqData.answer;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      this.getCandidateInfo();
    }
  }

  getCandidateInfo() {
    if (!this.faqId) {
      return;
    }
    this.loading = true;
    this.commonService.get(`Faqs/${this.faqId}`).subscribe((response: any) => {
      this.faq = response;
    });
  }

  selectBranch(event: any) {
    const combobox = event.detail;
    const selectedItem = combobox.item;
    if (selectedItem) {
      this.faq.id = selectedItem.id;
      console.log(selectedItem);
    } else {
    }
  }
  updateData() {
    if (!this.question || !this.answer) {
      this.errorMessage = 'Both Question and Answer fields are required.';
      return;
    }

    const formData = {
      question: this.question,
      answer: this.answer,
    };
        this.ToastType = 'edit';
    this.formloading = true;

    this.commonService.put(`Faqs(${this.faqId!})`, formData, true).subscribe({
      next: (response: any) => {
        this.formloading = false;


        // Close modal first
        this.isOpen = false;
        // this.close.emit();

        // Refresh table immediately
        this.refreshTable.emit();

        // Show toast (make sure it's listening to this event)
        this.IsOpenToastAlert.emit();

        console.log('FAQ updated successfully');
      },
      error: (error: any) => {
        this.formloading = false;
        this.isEditError = true;
        this.errorMessage = error.error?.message || 'Error updating FAQ';
        console.error('Error updating FAQ:', error);
      },
    });
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }

  resetForm(form: NgForm) {
    form.resetForm();
  }
  clearErrorMessage(event: Event) {
    event.stopPropagation();
    this.errorMessage = '';
  }
}
