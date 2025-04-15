import { Routes } from '@angular/router';
import { LoginComponent } from '@app/components/login/login.component';
import { UserListComponent } from '@app/user-managment/user-list/user-list.component';
import { CommonFormComponent } from '@app/form-data/common-form/common-form.component'
import { ServicesListComponent } from '@app/service-page/services-list/services-list.component';
import { FaqListComponent } from '@app/faq/faq-list/faq-list.component';
import { ContactUsFormComponent } from '@app/form-data/contact.us.form/contact.us.form.component';
import { JobListComponent } from '@app/jobs/job-list/job-list.component';
import { JobApplicationsComponent } from '@app/jobs/job-applications/job-applications.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'user-managment', component: UserListComponent},
    {path: 'common-form', component: CommonFormComponent},
    {path: 'contact-us-form', component: ContactUsFormComponent},
    {path: 'service-list', component: ServicesListComponent},
    {path: 'faq-list', component: FaqListComponent},
    { path: 'job-list', component: JobListComponent },
    {path : 'job-applications', component: JobApplicationsComponent}
];
