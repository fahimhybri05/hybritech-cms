import { Routes } from '@angular/router';
import { HomeComponent } from '@app/home/home.component';
import { ServicePageComponent } from '@app/service-page/service-page.component';
import { AboutUsPageComponent } from '@app/about-us-page/about-us-page.component';
import { ContactUsPageComponent } from '@app/contact-us-page/contact-us-page.component';
import { CareerPageComponent } from '@app/career-page/career-page.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    {path: 'services', component: ServicePageComponent},
    {path: 'about', component: AboutUsPageComponent},
    {path: 'career', component: CareerPageComponent},
    {path: 'contact', component: ContactUsPageComponent}
];
