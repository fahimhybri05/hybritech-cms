import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private apiUrl = environment.ServerApi;
  private commonFromData = this.apiUrl + "/odata/CommonForms";
  private commonConatactFormData = this.apiUrl + "/odata/ContactUsForms";
  private faqData = this.apiUrl + "/odata/Faqs"; 

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
}
