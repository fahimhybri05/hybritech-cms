import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQComponent } from "../components/faq/faq.component";
import { FormComponent } from "../components/form/form.component";
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-service-page',
  standalone: true,
  imports: [ FAQComponent, FormComponent,CommonModule],
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.css'
})
export class ServicePageComponent {
  services = [
    {
      title: 'Website Development',
      description: 'Our creative and talented team of designers as well as skilled technical developers will build your site to order.',
      icon: `../../assets/img/webDev.svg`,
    },
    {
      title: 'Mobile App Development',
      description: 'We develop native iOS and Android apps using React Native, Flutter, or Ionic, ensuring top-tier app experiences.',
      icon: `../../assets/img/webDev.svg`,
    },
    {
      title: 'Backend Development',
      description: 'We build fast, scalable, and secure back-end applications, integrated with APIs or custom-built solutions.',
      icon: `../../assets/img/webDev.svg`,
    },
    {
      title: 'E-commerce Web Development',
      description: 'We create high-quality online stores using Shopify, BigCommerce, and other ecommerce solutions to elevate your online business.',
      icon: `../../assets/img/webDev.svg`,
    },
  ];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void { }


  getSanitizedIcon(icon: string) {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}