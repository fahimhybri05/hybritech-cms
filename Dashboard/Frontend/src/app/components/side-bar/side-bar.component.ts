import { CommonModule } from "@angular/common";
import { Component, Input, Output} from "@angular/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {RouterLink } from "@angular/router";
import { SocialMediaComponent } from "@app/social-media/social-media.component";
import { ContactInfoComponent } from "@app/contact-info/contact-info.component";
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule,SocialMediaComponent,ContactInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SidebarComponent {
	@Input() collapsed: boolean = true;
  isOpen: boolean = false;
  isContactOpen: boolean = false;
  type: string | null = null;
  showContactModal = false;
  onSocialMediaClick(event: any) {
	  this.isOpen = true;
  }
  onContactInfoClick(event: Event) {
   this.isContactOpen =true;
  }
}
