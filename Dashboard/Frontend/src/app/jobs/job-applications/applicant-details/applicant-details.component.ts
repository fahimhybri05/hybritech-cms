import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";


@Component({
  selector: 'app-applicant-details',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './applicant-details.component.html',
  styleUrl: './applicant-details.component.css',
})
export class ApplicantDetailsComponent {
  @Input() jobId: number | null = null;
  @Input() jobData: any = {};
  @Input() isOpen: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  formloading: boolean = false;

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
