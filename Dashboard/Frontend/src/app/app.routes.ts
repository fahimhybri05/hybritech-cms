import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './user-managment/user-list/user-list.component';
import { CommonFormComponent } from './form-data/common-form/common-form.component'
import { ServicesListComponent } from './service-page/services-list/services-list.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component';
import { ContactUsFormComponent } from './form-data/contact.us.form/contact.us.form.component';
import { JobListComponent } from './job-posts/job-list/job-list.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'user-managment', component: UserListComponent},
    {path: 'common-form', component: CommonFormComponent},
    {path: 'contact-us-form', component: ContactUsFormComponent},
    {path: 'service-list', component: ServicesListComponent},
    {path: 'faq-list', component: FaqListComponent},
    {path: 'job-list', component: JobListComponent}
];
