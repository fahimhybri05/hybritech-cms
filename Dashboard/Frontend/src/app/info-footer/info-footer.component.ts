import { Component, EventEmitter, input, Output } from '@angular/core';
import { ContactInfoComponent } from '@app/contact-info/contact-info.component';
import { CommonService } from '@app/services/common-service/common.service';
import { SocialMediaComponent } from '@app/social-media/social-media.component';
import { Ui5MainModule } from '@ui5/webcomponents-ngx';
import { ToastMessageComponent } from "../components/toast-message/toast-message.component";


@Component({
  selector: 'app-info-footer',
  standalone: true,
  imports: [ContactInfoComponent, SocialMediaComponent, Ui5MainModule, ToastMessageComponent],
  templateUrl: './info-footer.component.html',
  styleUrl: './info-footer.component.css'
})
export class InfoFooterComponent {
  @Output() IsOpenToastAlert = new EventEmitter<void>();
loading: boolean = false;
isActive:any;
title: string = '';
  ToastType: string = '';

constructor(private commonService: CommonService) {

}
ngOnInit() {
  this.getPermissions();
}

getPermissions() {
  this.commonService.get(`WebPages(1)`, true).subscribe({
    next: (response: any) => {
      this.isActive = response.is_active;
    },
    error: (error: any) => {
      console.error('Error Getting Project Permission:', error);
    },
  });
}

toggleActive($event: any) {
  if ($event.target.checked) {
    this.isActive = true;
  } else {
    this.isActive = false;
  }
}
  updateData() {

    const permissionData = {
      is_active: this.isActive ? true : false,
    };
    this.loading = true;
    this.commonService.put(`WebPages(1)`, permissionData, true).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.ToastType = 'edit';
        this.IsOpenToastAlert.emit();
      },
      error: (error: any) => {
        console.error('Error updating Projects:', error);
      },
    });
  }

}
