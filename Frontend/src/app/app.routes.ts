import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicePageComponent } from './service-page/service-page.component';
import { AboutUsPageComponent } from './about-us-page/about-us-page.component';
import { ContactUsPageComponent } from './contact-us-page/contact-us-page.component';
import { CareerPageComponent } from './career-page/career-page.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    {path: 'services', component: ServicePageComponent},
    {path: 'about', component: AboutUsPageComponent},
    {path: 'career', component: CareerPageComponent},
    {path: 'contact', component: ContactUsPageComponent}
];
