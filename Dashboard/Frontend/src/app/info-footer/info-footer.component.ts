import { Component, EventEmitter, input, Output } from '@angular/core';
import { ContactInfoComponent } from '@app/contact-info/contact-info.component';
import { CommonService } from '@app/services/common-service/common.service';
import { SocialMediaComponent } from '@app/social-media/social-media.component';
import { Ui5MainModule } from '@ui5/webcomponents-ngx';
import { ToastMessageComponent } from '../components/toast-message/toast-message.component';

@Component({
  selector: 'app-info-footer',
  standalone: true,
  imports: [
    ContactInfoComponent,
    SocialMediaComponent,
    Ui5MainModule,
    ToastMessageComponent,
  ],
  templateUrl: './info-footer.component.html',
  styleUrl: './info-footer.component.css',
})
export class InfoFooterComponent {
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  loading: boolean = false;
  isActive: any;
  title: string = '';
  webID: number = 0;
  ToastType: string = '';

<<<<<<< HEAD
  constructor(private commonService: CommonService) {}
  ngOnInit() {
    this.getPermissions();
  }

  getPermissions() {
    this.commonService.get(`WebPages`, true).subscribe({
      next: (response: any) => {
        this.webID = response.value[0].id;
        this.isActive = response.value[0].is_active;
      },
      error: (error: any) => {
        console.error('Error fetching project section:', error);
=======
constructor(private commonService: CommonService) {

}
ngOnInit() {
  this.getProjectPermission();
}

getProjectPermission() {
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
>>>>>>> 3f2efe297a388623700d5eff642ab1e3ff955b6b
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
      is_active: this.isActive,
    };
    this.ToastType = 'edit';

    this.commonService
      .put(`WebPages(${this.webID})`, permissionData, true)
      .subscribe({
        next: (response: any) => {
          this.IsOpenToastAlert.emit();
        },
        error: (error: any) => {
          console.error('Error updating project section:', error);
        },
      });
  }
}
