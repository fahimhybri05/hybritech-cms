import { Component, EventEmitter, Output } from '@angular/core';
import { CommonService } from '@app/services/common-service/common.service';
import { SocialMediaComponent } from '@app/social-media/social-media.component';
import { Ui5MainModule } from '@ui5/webcomponents-ngx';
import { ToastMessageComponent } from '../components/toast-message/toast-message.component';
import { ContactInfoComponent } from '@app/contact-info/contact-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-footer',
  standalone: true,
  imports: [
    ContactInfoComponent,
    SocialMediaComponent,
    Ui5MainModule,
    ToastMessageComponent,
    CommonModule
  ],
  templateUrl: './info-footer.component.html',
  styleUrl: './info-footer.component.css',
})
export class InfoFooterComponent {
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  loading: boolean = false;
  webPages: any[] = [];
  ToastType: string = '';

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.getProjectPermission();
  }

  getProjectPermission() {
    this.loading = true;
    this.commonService.get(`WebPages`, true).subscribe({
      next: (response: any) => {
        this.webPages = response.value;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching project section:', error);
        this.loading = false;
      },
    });
  }


  toggleActive(item: any, event: any) {
    item.is_active = event.target.checked;
  }

  updateData() {
    this.loading = true;
    const updatePromises = this.webPages.map(page => {
      const permissionData = {
        id:page.id,
        is_active: page.is_active,
      };
      return this.commonService.patch(`WebPages(${page.id})`, permissionData, true).toPromise();
    });

    Promise.all(updatePromises)
      .then(() => {
        this.ToastType = 'edit';
        this.IsOpenToastAlert.emit();
        this.loading = false;
      })
      .catch(error => {
        console.error('Error updating sections:', error);
        this.loading = false;
      });
  }
}