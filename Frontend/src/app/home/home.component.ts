import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FAQComponent } from '../components/faq/faq.component';
import { FooterComponent } from '../components/footer/footer.component';
import { FormComponent } from '../components/form/form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FAQComponent, FormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  
}
