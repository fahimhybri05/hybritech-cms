import { Component } from '@angular/core';
import { ContactInfoComponent } from '@app/contact-info/contact-info.component';
import { SocialMediaComponent } from '@app/social-media/social-media.component';
import { Ui5MainModule } from '@ui5/webcomponents-ngx';


@Component({
  selector: 'app-info-footer',
  standalone: true,
  imports: [ContactInfoComponent,SocialMediaComponent,Ui5MainModule],
  templateUrl: './info-footer.component.html',
  styleUrl: './info-footer.component.css'
})
export class InfoFooterComponent {
loading: boolean = false;
isActive: boolean = false;




toggleActive($event: any) {
  if ($event.target.checked) {
    this.isActive = true;
  } else {
    this.isActive = false;
  }
}
}
