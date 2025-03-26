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
import { FormPreloaderComponent } from "app/components/form-preloader/form-preloader.component";
import {	LabelComponent,TextAreaComponent} from "@ui5/webcomponents-ngx";
import { CommonService } from "app/services/common-service/common.service";

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
  @Input() faqId: number | null = null;   // FAQ ID passed from parent
  @Input() faqData: any = {};             // FAQ data passed from parent
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
    this.close.emit();  // Emit the close event to parent component
  }
}