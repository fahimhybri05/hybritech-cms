import { CommonModule } from "@angular/common";
import { Component, Input, Output} from "@angular/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {RouterLink } from "@angular/router";
import { SocialMediaComponent } from "@app/social-media/social-media.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule,SocialMediaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SidebarComponent {
	@Input() collapsed: boolean = true;
  isOpen: boolean = false;
  type: string | null = null;
  
  onSocialMediaClick(event: any) {
	  this.isOpen = true;
  }
}
