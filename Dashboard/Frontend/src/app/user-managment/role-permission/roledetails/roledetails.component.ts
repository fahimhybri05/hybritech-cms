import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roledetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.name = this.RoleData.name;
    }, 20000);
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
  }
}
