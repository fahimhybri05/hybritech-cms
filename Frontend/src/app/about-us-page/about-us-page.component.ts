import { Component } from '@angular/core';
import { FormComponent } from "../components/form/form.component";

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css'
})
export class AboutUsPageComponent {

}
