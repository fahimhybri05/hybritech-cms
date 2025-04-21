import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
import { LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
import { CommonService } from '@app/services/common-service/common.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    FormPreloaderComponent,
    TextAreaComponent,
    ToastMessageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent implements OnInit {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();

  loading: boolean = false;
  isAddError: boolean = false;
  api: boolean;
  ToastType: string = '';
  errorMessage: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  position: string = '';
  image_url: string = '';

  constructor(private commonService: CommonService) {
    this.api = commonService.api;
  }
  ngOnInit(): void {}

  insertData() {
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.position ||
      !this.image_url
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      position: this.position,
      image_url: this.image_url,
    };
    console.log(data);
    this.loading = true;
    this.commonService.post('register', data, this.api).subscribe(
      (response) => {
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
    this.email = '';
    this.password = '';
    this.position = '';
    this.image_url = '';
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
