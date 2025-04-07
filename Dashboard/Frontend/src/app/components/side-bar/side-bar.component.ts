import { CommonModule } from "@angular/common";
import { Component, Input} from "@angular/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {RouterLink } from "@angular/router";

@Component({
	selector: "app-sidebar",
	standalone: true,
	imports: [RouterLink, CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SidebarComponent {
	@Input() collapsed: boolean = true;
	type: string | null = null;
}
