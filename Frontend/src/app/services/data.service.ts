import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.ServerApi;
  private commonFromData = this.apiUrl + '/api/common-forms';
  private commonConatactFormData = this.apiUrl + '/api/contact-forms';
  private faqData = this.apiUrl + '/odata/Faqs?$filter=is_active eq true';
  private serviceData = this.apiUrl + '/api/service-pages?$filter=is_active eq true';
  private jobPostData = this.apiUrl + '/odata/JobLists?$filter=is_active eq true';
  private footerData = this.apiUrl + '/odata/Footers?$filter=is_active eq true';
  private applicationData = this.apiUrl + '/api/job-applications';
  private addressData = this.apiUrl + '/odata/AddressInfos';
  private projectData = this.apiUrl + '/api/projects?$filter=is_active eq true';
  private teamData = this.apiUrl + '/api/teams?$filter=is_active eq true';
  private webPages = this.apiUrl + '/odata/WebPages?$filter=is_active eq true';
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
  getAddressData(): Observable<any> {
    return this.http.get<any>(this.addressData);
  }
    getProjectData(): Observable<any> {
    return this.http.get<any>(this.projectData);
  }
  getTeamData(): Observable<any> {
    return this.http.get<any>(this.teamData);
  }
  getWebPageData(): Observable<any> {
    return this.http.get<any>(this.webPages);
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
