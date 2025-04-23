import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';
@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    FormPreloaderComponent,
    TextAreaComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
})
export class ServiceDetailsComponent implements OnChanges {
  @Input() isOpen: boolean | null = null;
  @Input() serviceId: number | null = null;
  @Input() serviceData: any = null;
  loading: boolean = false;
  title: string = '';
  description: string = '';
  wordCount: number = 0;
  maxWords: number = 45;
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  currentImageUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceData'] && this.serviceData) {
      this.title = this.serviceData.title || '';
      this.description = this.serviceData.description || '';
      if (this.serviceData.media) {
        this.currentImageUrl = this.serviceData.media[0].original_url;
      }
    }
  }
  closeDialog() {
    this.isOpen = false;
  }
}

