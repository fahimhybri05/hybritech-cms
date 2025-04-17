import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './user-managment/user-list/user-list.component';
import { CommonFormComponent } from './form-data/common-form/common-form.component'
import { ServicesListComponent } from './service-page/services-list/services-list.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component';
import { ContactUsFormComponent } from './form-data/contact.us.form/contact.us.form.component';
import { HomeComponent } from './home/home.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobApplicationsComponent } from './jobs/job-applications/job-applications.component';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'user-managment', component: UserListComponent},
    {path: 'common-form', component: CommonFormComponent},
    {path: 'contact-us-form', component: ContactUsFormComponent},
    {path: 'service-list', component: ServicesListComponent},
    {path: 'faq-list', component: FaqListComponent},
    { path: 'job-list', component: JobListComponent },
    {path : 'job-applications', component: JobApplicationsComponent}
];
