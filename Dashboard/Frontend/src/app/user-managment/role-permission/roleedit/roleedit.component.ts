import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { CommonService } from '@app/services/common-service/common.service';
import { Role } from '@app/shared/Model/Role';
import {
  LabelComponent,
  Ui5MainModule,
} from '@ui5/webcomponents-ngx';
@Component({
  selector: 'app-roleedit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LabelComponent,
    FormPreloaderComponent,
    ToastMessageComponent,
    Ui5MainModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './roleedit.component.html',
  styleUrl: './roleedit.component.css',
})
export class RoleeditComponent {
  @Input() isOpen: boolean | null = null;
  @Input() RoleId: number | null = null;
  @Input() RoleData: any = {};
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  isSuccess: boolean = false;
  isEditError: boolean = false;
  sucessMessage: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  formloading: boolean = false;
  isActive: boolean = false;
  name: string = '';
  rolse = Role;
  api:boolean;
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.api = this.commonService.api;
  }
  ngOnInit(): void {
    if (this.RoleData) {
      this.rolse = this.RoleData.name;
      this.loadRoleData();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      if (this.RoleData) {
        this.loadRoleData();
      } else if (this.RoleId) {
        this.getRoleInfo();
      }
    }
  }

  loadRoleData(): void {
    this.name = this.RoleData.name || '';
    this.isActive = this.RoleData.is_active === true;
  }

  getRoleInfo(): void {
    if (!this.RoleId) return;

    this.loading = true;
    this.commonService.get(`roles/${this.RoleId}`).subscribe({
      next: (response: any) => {
        console.log(response);
        this.RoleData = response;
        this.loadRoleData();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }
  updateRole() {
    const formData = {
      name: this.name,
      is_active: this.isActive,
    };

    this.formloading = true;
    this.commonService
      .put(`roles/${this.RoleId}`, formData, this.api)
      .subscribe({
        next: (response: any) => {
          this.formloading = false;
          this.isSuccess = true;
          this.ToastType = 'edit';
          setTimeout(() => {
            this.IsOpenToastAlert.emit();
          }, 1000);
          this.closeDialog();
        },
        error: (error: any) => {
          this.formloading = false;
          this.isEditError = true;
          this.errorMessage = error.error?.message || 'Error updating Role';
        },
      });
  }
  toggleActive($event: any) {
    this.isActive = $event.target.checked;
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
