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
import { LabelComponent, TextAreaComponent } from '@ui5/webcomponents-ngx';
import { CommonService } from 'app/services/common-service/common.service';

@Component({
  selector: 'app-edit-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, LabelComponent, TextAreaComponent],
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

  loading: boolean = true;
  errorMessage: string = '';
  formloading: boolean = false;

  odata: boolean;
  api: boolean;

  isSuccess: boolean = false;
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
    this.formloading = true;
    this.commonService
      .put(`Faqs(${this.faqId!})`, formData, true)
      .subscribe({
        next: (response: any) => {
          this.formloading = false;
          this.isSuccess = true;
          this.sucessMessage = 'FAQ updated successfully';
          this.refreshTable.emit();
          this.closeDialog();
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
