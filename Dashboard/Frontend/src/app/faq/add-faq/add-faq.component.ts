import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { CommonService } from '@app/services/common-service/common.service';


@Component({
  selector: 'app-add-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    FormPreloaderComponent,
    TextAreaComponent,
    ToastMessageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-faq.component.html',
  styleUrl: './add-faq.component.css',
})
export class AddFaqComponent implements OnInit {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();

  loading: boolean = false;
  isAddError: boolean = false;
  ToastType: string = '';
  errorMessage: string = '';
  answer: string = '';
  question: string = '';

  constructor(
    private commonService: CommonService,
  ) {}
  ngOnInit(): void {}

  insertData() {
    if (!this.question || !this.answer) {
      this.errorMessage =  'Both Question and Answer fields are required.';
      return;
    }

    const data = {
      question: this.question,
      answer: this.answer,
    };

    this.loading = true;
    this.commonService.post('Faqs', data).subscribe(
      (response) => {
        console.log(response);
        this.loading = false;
        this.ToastType = 'add';
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.rersetForm();
        this.closeDialog();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while submitting the data.';
        console.error(error);
      }
    );
  }
  rersetForm() {
    this.errorMessage = '';
    this.question = '';
    this.answer = '';
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
