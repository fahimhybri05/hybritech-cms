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
  selector: 'app-team-details',
  standalone: true,
  imports: [
     CommonModule,
     FormsModule,
     LabelComponent,
     FormPreloaderComponent,
     TextAreaComponent,
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css'
})
export class TeamDetailsComponent {
@Input() isOpen: boolean | null = null;
  @Input() teamId: number | null = null;
  @Input() teamData: any = null;
  @Output() close = new EventEmitter<void>();
  loading: boolean = false;
  name: string = '';
  designation: string = '';
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  currentImageUrl: string | null = null;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teamData'] && this.teamData) {
      this.name = this.teamData.name || '';
      this.designation = this.teamData.designation || '';
      if (this.teamData.media) {
        this.currentImageUrl = this.teamData.media[0].original_url;
      }
    }
  }
  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}