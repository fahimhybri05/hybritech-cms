import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { CommonService } from '@app/services/common-service/common.service';
import { Role } from '@app/shared/Model/Role';
import { LabelComponent, Ui5MainModule } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';

@Component({
  selector: 'app-roleadd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    FormPreloaderComponent,
    TextAreaComponent,
    ToastMessageComponent,
    Ui5MainModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './roleadd.component.html',
  styleUrl: './roleadd.component.css',
})
export class RoleaddComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();

  loading: boolean = false;
  isAddError: boolean = false;
  isActive: boolean = true;
  odata: boolean;
  ToastType: string = '';
  errorMessage: string = '';
  name: string = '';
  rolse = Role;
  constructor(private commonService: CommonService) {
    this.odata = this.commonService.odata;
  }
  ngOnInit(): void {}

  insertData() {
    if (!this.rolse.name) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    const data = {
      name: this.name,
      is_active: this.isActive,
    };
    this.loading = true;
    this.commonService.post('Roles', data, this.odata).subscribe(
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
    this.name = '';
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
