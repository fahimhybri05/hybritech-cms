import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonService } from '@app/services/common-service/common.service';
import { ToastComponent, MessageStripComponent } from '@ui5/webcomponents-ngx';
@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [ToastComponent, MessageStripComponent, CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.css',
})
export class ToastMessageComponent implements OnInit {
  Duration: number;
  @Input() IsOpenToastAlert: EventEmitter<void> = new EventEmitter<void>();
  @Input() IsOpenToast: boolean = false;
  @Input() ToastMessage: string = '';
  @Input() ToastType: string = '';

  Message = {
    delete: 'Deleted successfully',
    remove: 'Removed successfully',
    edit: 'Updated successfully',
    add: 'Added successfully',
    mark: 'Marked as read',
    error: 'Somthing went wrong',
  };

  constructor(commonservices: CommonService) {
    this.Duration = commonservices.ToastDration;
  }
  ngOnInit(): void {
    if (this.IsOpenToast) {
      setTimeout(() => {
        this.IsOpenToast = false;
      }, this.Duration);
    }
    this.IsOpenToastAlert.subscribe(() => {
      this.IsOpenToast = true;
      if (this.ToastType == 'delete') {
        this.ToastMessage = this.Message.delete;
        return;
      }
      if (this.ToastType == 'remove') {
        this.ToastMessage = this.Message.remove;
        return;
      }
      if (this.ToastType == 'edit') {
        this.ToastMessage = this.Message.edit;
        return;
      }
      if (this.ToastType == 'add') {
        this.ToastMessage = this.Message.add;

        return;
      }
      if (this.ToastType == 'mark') {
        this.ToastMessage = this.Message.mark;
        return;
      }
      if (this.ToastType == 'error') {
        this.ToastMessage = this.Message.error;
        return;
      }
    });
  }

  CloseToast(e: any) {
    this.IsOpenToast = false;
  }
}
