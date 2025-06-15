import { Routes } from '@angular/router';
import { AuthGuard } from '@app/services/auth/guard/auth.guard';
import { LoginComponent } from '@app/components/login/login.component';
import { UserListComponent } from '@app/user-managment/user-list/user-list.component';
import { CommonFormComponent } from '@app/form-data/common-form/common-form.component';
import { ServicesListComponent } from '@app/service-page/services-list/services-list.component';
import { FaqListComponent } from '@app/faq/faq-list/faq-list.component';
import { ContactUsFormComponent } from '@app/form-data/contact.us.form/contact.us.form.component';
import { HomeComponent } from '@app/home/home.component';
import { JobListComponent } from '@app/jobs/job-list/job-list.component';
import { JobApplicationsComponent } from '@app/jobs/job-applications/job-applications.component';
import { InfoFooterComponent } from '@app/info-footer/info-footer.component';
import { ProjectListComponent } from '@app/our-projects/project-list/project-list.component';
import { SelectedApplicantsComponent } from '@app/jobs/selected-applicants/selected-applicants.component';
import { EmailListComponent } from '@app/jobs/email-list/email-list.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user-managment',
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-managment',
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'common-form',
    component: CommonFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contact-us-form',
    component: ContactUsFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service-list',
    component: ServicesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'faq-list',
    component: FaqListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-list',
    component: JobListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-applications',
    component: JobApplicationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-footer',
    component: InfoFooterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'selected-applicants',
    component: SelectedApplicantsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'email-list',
    component: EmailListComponent,
    canActivate: [AuthGuard],
  }
];
