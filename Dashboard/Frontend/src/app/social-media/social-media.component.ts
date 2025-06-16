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
import { CommonService } from '@app/services/common-service/common.service';
import { InputComponent } from '@ui5/webcomponents-ngx';
import { forkJoin } from 'rxjs';
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';
@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ToastMessageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './social-media.component.html',
  styleUrl: './social-media.component.css',
})
export class SocialMediaComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() isOpen: boolean = false;
  @Output() Global: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = '';
  formloading: boolean = false;
  isActive: any;
  odata: boolean;
  loading: boolean = false;
  socialMedia: any[] = [];
  socialMediaUrl: any;

  constructor(private commonService: CommonService) {
    this.odata = this.commonService.odata;
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.loading = true;
    this.commonService.get('Footers', this.odata).subscribe({
      next: (response: any) => {
        this.socialMedia = response.value || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading data:', error);
        this.loading = false;
      },
    });
  }
  onSubmit() {
    this.formloading = true;
    this.loading = true;
    const formData = this.socialMedia.map((item: any) => ({
      id: item.id,
      link: item.link,
      is_active: item.is_active,
    }));

    const requests = formData.map((item: any) =>
      this.commonService.patch(`Footers(${item.id})`, item)
    );
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        this.formloading = false;
        this.loading = false;
        this.ToastType = 'edit';
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.IsOpenToastAlert.emit();
        this.Global.emit();
      },
      error: (error: any) => {
        console.error('Error submitting form:', error);
        this.formloading = false;
        this.loading = false;
      },
    });
  }
  toggleActive(item: any, event: any) {
    item.is_active = event.target.checked;
  }
}
