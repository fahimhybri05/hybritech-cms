import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonService } from '@app/services/common-service/common.service';
import { Address } from '@app/shared/Model/address';
import { InputComponent } from '@ui5/webcomponents-ngx';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ToastMessageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css',
})
export class ContactInfoComponent implements OnInit {
  @Input() contactData: any = {};
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();

  loading: boolean = true;
  errorMessage: string = '';
  formloading: boolean = false;
  odata: boolean;
  api: boolean;
  isEditError: boolean = false;
  ToastType: string = '';
  isActive: any;
  sucessMessage: string = '';
  address = '';
  email = '';
  phone = '';
  editAddress = '';
  editEmail = '';
  editPhone = '';

  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) {
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
  }
  ngOnInit(): void {
    if (this.hasValidContactData()) {
      this.initFormValues();
    } else {
      this.getContactInfo();
    }
  }

  private hasValidContactData(): boolean {
    return (
      this.contactData &&
      (this.contactData.address ||
        this.contactData.email ||
        this.contactData.phone)
    );
  }

  private initFormValues(): void {
    this.address = this.contactData.address || '';
    this.email = this.contactData.email || '';
    this.phone = this.contactData.phone || '';
    this.editAddress = this.address;
    this.editEmail = this.email;
    this.editPhone = this.phone;
    this.loading = false;
  }

  getContactInfo(): void {
    this.loading = true;
    this.commonService.get(`AddressInfos`).subscribe({
      next: (response: any) => {
        this.contactData = response.value?.[0] || response;
        this.initFormValues();
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  updateContactInfo(): void {
    if (!this.editPhone || !this.editEmail || !this.editAddress) {
      return;
    }

    this.formloading = true;
    // console.log('Updating with:', {
    //   address: this.editAddress,
    //   email: this.editEmail,
    //   phone: this.editPhone,
    // });

    const payload = {
      address: this.editAddress,
      email: this.editEmail,
      phone: this.editPhone,
    };
    this.ToastType = 'edit';
    const recordId = this.contactData.id;
    this.commonService.patch(`AddressInfos(${recordId})`, payload).subscribe({
      next: () => {
        this.refreshTable.emit();
        this.address = this.editAddress;
        this.email = this.editEmail;
        this.phone = this.editPhone;
        this.formloading = false;
        this.IsOpenToastAlert.emit();
      },
      error: (error) => {
        this.formloading = false;
      },
    });
  }
}
