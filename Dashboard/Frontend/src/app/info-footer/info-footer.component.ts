import { Component } from '@angular/core';
import { ContactInfoComponent } from '@app/contact-info/contact-info.component';
import { SocialMediaComponent } from '@app/social-media/social-media.component';


@Component({
  selector: 'app-info-footer',
  standalone: true,
  imports: [ContactInfoComponent,SocialMediaComponent],
  templateUrl: './info-footer.component.html',
  styleUrl: './info-footer.component.css'
})
export class InfoFooterComponent {

}
