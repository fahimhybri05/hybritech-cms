
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SidebarComponent } from "../side-bar/side-bar.component";
import { AvatarComponent, BarComponent, PopoverComponent } from "@ui5/webcomponents-ngx";


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent,PopoverComponent, BarComponent, AvatarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isCollapsed: boolean = false;
  toggleSidenav(): void {
		this.isCollapsed = !this.isCollapsed;
		console.log(this.isCollapsed);
	}
}

