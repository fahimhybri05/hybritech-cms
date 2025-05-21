import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { Forms } from '@app/shared/Model/forms';
import { CommonService } from '@app/services/common-service/common.service';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';

@Component({
  selector: 'app-form-details',
  standalone: true,
  imports: [CommonModule,ToastMessageComponent,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './form.details.component.html',
  styleUrls: ['./form.details.component.css'],
})
export class FormDetailsComponent implements OnInit {
  @Input() formId: number | null = null;
  @Input() formData: Forms | null = null;
  @Input() isOpen: boolean = false;
    @Output() IsOpenToastAlert = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() updated: EventEmitter<Forms> = new EventEmitter<Forms>();
  @Output() refreshTable = new EventEmitter<void>();
  ToastType: string = '';
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  markAsRead() {
    if (!this.formData || !this.formData.id || this.formData.is_read) {
          
      return;
    }

    this.formData.is_read = true;
    this.updated.emit(this.formData);

    let apiUrl = '';

    if (this.formData.number) {
      apiUrl = `ContactUsForms(${this.formData.id})`;
    } else if (this.formData.id) {
      apiUrl = `CommonForms(${this.formData.id})`;
    } else {
      alert('Invalid form ID.');
      return;
    }

    let payload: any;

    if (!(this.formData instanceof Forms)) {
      this.formData = new Forms().deserialize(this.formData);
    }

    payload = this.formData.toOdata();

    this.commonService.put(apiUrl, payload).subscribe({
      next: (response: any) => {
        const newForm = new Forms().deserialize(response);
        this.formData = newForm;
        this.updated.emit(newForm);
          this.ToastType = 'mark';
          setTimeout(() => {
            this.IsOpenToastAlert.emit();
          }, 1000);
          this.closeDialog();
        this.refreshTable.emit();
      },
      error: (error: any) => {
        console.log('Error updating form:', error);
      },
    });
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
