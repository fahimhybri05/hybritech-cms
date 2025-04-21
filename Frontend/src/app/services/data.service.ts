import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.ServerApi;
  private commonFromData = this.apiUrl + '/odata/CommonForms';
  private commonConatactFormData = this.apiUrl + '/odata/ContactUsForms';
  private faqData = this.apiUrl + '/odata/Faqs?$filter=is_active eq true';
  private serviceData = this.apiUrl + '/api/service-pages';
  private jobPostData = this.apiUrl + '/odata/JobLists?$filter=is_active eq true';
  private footerData = this.apiUrl + '/odata/Footers?$filter=is_active eq true';
  private applicationData = this.apiUrl + '/api/job-applications';

  constructor(private http: HttpClient) {}

  insertCommonForm(formData: any): Observable<any> {
    return this.http.post(this.commonFromData, formData);
  }
  insertCotactForm(formData: any): Observable<any> {
    return this.http.post(this.commonConatactFormData, formData);
  }
  getFaqData(): Observable<any> {
    return this.http.get<any>(this.faqData);
  }
  getServiceData(): Observable<any> {
    return this.http.get<any>(`${this.serviceData}`);
  }
  getJobPostData(): Observable<any> {
    return this.http.get<any>(this.jobPostData);
  }
  getFooterData(): Observable<any> {
    return this.http.get<any>(this.footerData);
  }
  insertApplication(formData: any): Observable<any> {
    return this.http.post(this.applicationData, formData);
  }
}
