import { Routes } from '@angular/router';
import { AuthGuard } from '@app/services/auth/guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './user-managment/user-list/user-list.component';
import { CommonFormComponent } from './form-data/common-form/common-form.component';
import { ServicesListComponent } from './service-page/services-list/services-list.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component';
import { ContactUsFormComponent } from './form-data/contact.us.form/contact.us.form.component';
import { HomeComponent } from './home/home.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobApplicationsComponent } from './jobs/job-applications/job-applications.component';
import { InfoFooterComponent } from './info-footer/info-footer.component';
import { ProjectListComponent } from '@app/our-projects/project-list/project-list.component';
import { TeamListComponent } from './our-teams/team-list/team-list.component';
import { SelectedApplicantsComponent } from './jobs/selected-applicants/selected-applicants.component';
import { EmailListComponent } from './jobs/email-list/email-list.component';

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
    path: 'team-list',
    component: TeamListComponent,
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
