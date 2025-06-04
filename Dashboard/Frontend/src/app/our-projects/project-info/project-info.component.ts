import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '@ui5/webcomponents-ngx';
import { TextAreaComponent } from '@ui5/webcomponents-ngx/main/text-area';
import { FormPreloaderComponent } from '@app/components/form-preloader/form-preloader.component';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    FormPreloaderComponent,
    TextAreaComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnChanges {
  @Input() isOpen: boolean | null = null;
  @Input() projectId: number | null = null;
  @Input() projectData: any = { media: [] };
  @Output() close = new EventEmitter<void>();
  loading: boolean = false;
  title: string = '';
  subtitle: string = '';
  description: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectData'] && this.projectData) {
      this.title = this.projectData.title || '';
      this.subtitle = this.projectData.subtitle || '';
      this.description = this.projectData.description || '';
      this.projectData.media = this.projectData.media || [];
    }
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}