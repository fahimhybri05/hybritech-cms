import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule,} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';



@Component({
  selector: 'app-job-add',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,AngularEditorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './job-add.component.html',
  styleUrl: './job-add.component.css'
})
export class JobAddComponent {
  @Input() isOpen: boolean | null = null;
  @Output() close = new EventEmitter<void>();

  loading: boolean = false;
  isSuccess: boolean = false;
  isAddError: boolean = false;

  errorMessage: string = '';
  headerDescription: string = '';
  title: string = '';
  htmlContent = '';
  placeholder = '';


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
  };
  constructor(
    private commonService: CommonService,
    private router: Router,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {}

  insertData() {
    if (!this.headerDescription || !this.title) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const data = {
      question: this.title,
      answer: this.headerDescription,
    };

    this.loading = true; 
    this.commonService.post('Faqs', data).subscribe(
      (response: any) => {
        console.log(response);
        this.loading = false;
        this.isSuccess = true;
    this.rersetForm();
        this.closeDialog();
      },
      (error: any) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while submitting the data.';
        console.error(error);
      }
    );
  }
  rersetForm(){
  this.errorMessage = '';
  this.title = '';
  this.headerDescription = '';
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }

}
