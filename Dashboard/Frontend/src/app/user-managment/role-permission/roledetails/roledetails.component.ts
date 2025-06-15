import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-roledetails',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './roledetails.component.html',
  styleUrl: './roledetails.component.css',
})
export class RoledetailsComponent {
  @Input() RoleId: number | null = null;
  @Input() RoleData: any = {};
  @Input() isOpen: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  name: string = '';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      is_active: [false],
    });
  }

  ngOnInit(): void {}
  ngOnChanges(): void {
  setTimeout(() => {
    if (this.RoleData) {
      this.form.patchValue({
        name: this.RoleData.name,
        is_active: this.RoleData.is_active,
      });
    }
  }, 100);
}


  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
