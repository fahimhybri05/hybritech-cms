import { CommonModule, DatePipe } from "@angular/common";
import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";


@Component({
  selector: 'app-faq-details',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './faq-details.component.html',
  styleUrl: './faq-details.component.css'
})
export class FaqDetailsComponent implements OnInit {
  @Input() faqId: number | null = null;
  @Input() faqData: any = {};
  @Input() isOpen: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  question: string = "";
  answer: string = "";
  formloading: boolean = false;

  ngOnInit(): void {
    if (this.faqData) {
      this.question = this.faqData.question;  
      this.answer = this.faqData.answer;
    }
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();  
  }
}