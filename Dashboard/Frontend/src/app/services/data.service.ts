import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";


@Injectable({
	providedIn: "root",
})
export class DataService {
	private apiUrl = environment.ServerApi;
	private faqs = `${this.apiUrl}/odata/Faqs`;
	constructor(private http: HttpClient) {}
}
