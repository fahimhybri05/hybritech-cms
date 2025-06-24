import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '@app/services/common-service/common.service';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface BatchResponse {
  id: string;
  body: {
    '@count'?: number;
  };
}

interface CountItem {
  name: string;
  count: number;
  icon: string;
  route: string[];
  permission?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  countArray: CountItem[] = [];
  isLoading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.getCountValue();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private get batchApiConfig() {
    return {
      requests: [
        {
          id: 'services',
          method: 'GET',
          url: '/odata/ServicePageDetails?$count=true',
        },
        {
          id: 'jobPosts',
          method: 'GET',
          url: '/odata/JobLists?$count=true',
        },
        {
          id: 'jobApplicants',
          method: 'GET',
          url: '/odata/JobApplications?$count=true',
        },
        {
          id: 'faqList',
          method: 'GET',
          url: '/odata/Faqs?$count=true',
        },
        {
          id: 'commonFormData',
          method: 'GET',
          url: '/odata/CommonForms?$count=true',
        },
        {
          id: 'teams',
          method: 'GET',
          url: '/odata/TeamPageDetails?$count=true',
        },
        {
          id: 'contactUsFormData',
          method: 'GET',
          url: '/odata/ContactUsForms?$count=true',
        },
        {
          id: 'activesocialmedia',
          method: 'GET',
          url: '/odata/Footers?$filter=is_active eq true&$count=true',
        },
      ],
    };
  }

  getCountValue(): void {
    this.commonService
      .post('$batch', this.batchApiConfig)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error fetching counts:', err);
          this.initializeWithEmptyData();
          return of(null);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.processBatchResponse(res.responses || []);
          }
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }

  private processBatchResponse(responses: BatchResponse[]): void {
    const counts = responses.reduce((acc, response) => {
      if (response?.id && response?.body?.['@count'] !== undefined) {
        acc[response.id] = response.body['@count'];
      }
      return acc;
    }, {} as Record<string, number>);

    this.countArray = [
      this.createCountItem('Services', counts['services'], 'database', [
        '/service-list',
      ]),
      this.createCountItem('Job Posts', counts['jobPosts'], 'business-card', [
        '/job-list',
      ]),
      this.createCountItem(
        'Job Applicants',
        counts['jobApplicants'],
        'employee',
        ['/job-applications']
      ),
      this.createCountItem('FAQs', counts['faqList'], 'question-mark', [
        '/faq-list',
      ]),
      this.createCountItem('Common Forms', counts['commonFormData'], 'form', [
        '/common-form',
      ]),
      this.createCountItem('Teams', counts['teams'], 'form', [
        '/team-list',
      ]),
      this.createCountItem('Contact Us', counts['contactUsFormData'], 'email', [
        '/contact-us-form',
      ]),
      this.createCountItem(
        'Active Social Media',
        counts['activesocialmedia'],
        'detail-view',
        ['']
      ),
    ];
  }

  private createCountItem(
    name: string,
    count: number = 0,
    icon: string,
    route: string[]
  ): CountItem {
    return {
      name,
      count: count || 0,
      icon,
      route,
    };
  }

  private initializeWithEmptyData(): void {
    this.countArray = [
      this.createCountItem('Services', 0, 'database', ['services']),
      this.createCountItem('Job Posts', 0, 'business-card', ['job-posts']),
      this.createCountItem('Job Applications', 0, 'employee', [
        'job-applications',
      ]),
      this.createCountItem('FAQs', 0, 'question-mark', ['faqs']),
      this.createCountItem('Common Forms', 0, 'form', ['common-forms']),
      this.createCountItem('Contact Us', 0, 'email', ['contact-us']),
      this.createCountItem('Contact Us', 0, 'detail-view', ['']),
    ];
  }
}
