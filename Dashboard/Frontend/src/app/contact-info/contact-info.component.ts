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
  imports: [CommonModule, FormsModule, InputComponent,ToastMessageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css',
})
export class ContactInfoComponent implements OnInit {
  @Input() contactData: any = {};
  @Input() isContactOpen: boolean = false;
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
  // Original values
  address: string = '';
  email: string = '';
  phone: string = '';
  
  // Editable values
  editAddress: string = '';
  editEmail: string = '';
  editPhone: string = '';

  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) {
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
  }

  ngOnInit(): void {
    this.initFormValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isContactOpen'] && changes['isContactOpen'].currentValue) {
      this.getCandidateInfo();
    }
    
    if (changes['contactData'] && changes['contactData'].currentValue) {
      this.initFormValues();
    }
  }

  initFormValues() {
    const data = this.contactData.value?.[0] || this.contactData;
    this.address = data.address || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    
    // Initialize editable fields with current values
    this.editAddress = this.address;
    this.editEmail = this.email;
    this.editPhone = this.phone;
  }

  getCandidateInfo() {
    this.loading = true;
    this.commonService.get(`AddressInfos`).subscribe({
      next: (response: any) => {
        const contactInfo = response.value?.[0];
        this.contactData = contactInfo;
        if (contactInfo) {
          this.address = contactInfo.address || '';
          this.email = contactInfo.email || '';
          this.phone = contactInfo.phone || '';
          
          // Update editable fields
          this.editAddress = this.address;
          this.editEmail = this.email;
          this.editPhone = this.phone;
        }
        
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.IsOpenToastAlert.emit();
      }
    });
  }
  updateContactInfo() {
    if (!this.editPhone || !this.editEmail || !this.editAddress) {
      this.IsOpenToastAlert.emit();
      return;
      }

  
    this.formloading = true;
    
    const payload = {
      address: this.editAddress,
      email: this.editEmail,
      phone: this.editPhone
    };
  
    const recordId = this.contactData.id; 
  
    this.commonService.patch(`AddressInfos(${recordId})`, payload).subscribe({
      next: () => {
        this.formloading = false;
        this.isContactOpen = false;
        this.refreshTable.emit();
        this.IsOpenToastAlert.emit();
      },
      error: (error) => {
        this.formloading = false;
          this.isEditError = true;
          this.errorMessage = error.error?.message || 'Error updating FAQ';
      }
    });
  }
  
  // private handleUpdateSuccess() {
  //   this.formloading = false;
  //   this.address = this.editAddress;
  //   this.email = this.editEmail;
  //   this.phone = this.editPhone;
    
  //   this.IsOpenToastAlert.emit({
  //     type: 'Success',
  //     message: 'Address updated successfully'
  //   });
  //   this.refreshTable.emit();
  //   this.closeDialog();
  // }
  
  // private handleUpdateError(error: any) {
  //   this.formloading = false;
    
  //   let errorMessage = 'Failed to update contact information';
  //   if (error.error?.message) {
  //     errorMessage = error.error.message;
  //   }
  
  //   this.IsOpenToastAlert.emit({
  //     type: 'Error',
  //     message: errorMessage
  //   });
  // }
 
    closeDialog() {
    this.isContactOpen = false;
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
