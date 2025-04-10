import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  odata: boolean = true;
  api: boolean = false;
  itemsPerPage: number = 21;
  ToastDration: number = 2000;

  private lodataPrefix = environment.ServerApi + '/odata';
  private apiPrefix = environment.ServerApi + '/api';

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request
   * @param url Endpoint URL
   * @param isLodata Use Lodata prefix
   * @param params Optional query parameters
   * @param headers Optional custom headers
   */
  get<T>(
    url: string,
    isLodata: boolean = true,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders({ 'Cache-Control': 'no-cache' })
  ): Observable<T> {
    const urlPrefix = isLodata ? this.lodataPrefix : this.apiPrefix;
    const modifiedUrl = `${urlPrefix}/${url}`;
    return this.http.get<T>(modifiedUrl, { headers, params });
  }

  /**
   * Generic POST request
   * @param url Endpoint URL
   * @param body Request payload
   * @param isLodata Use Lodata prefix
   * @param headers Optional custom headers
   */
  post<T>(
    url: string,
    body: any,
    isLodata: boolean = true,
    headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }),
    responseType: 'json' | 'blob' | 'text' = 'json'
  ): Observable<T> {
    const urlPrefix = isLodata ? this.lodataPrefix : this.apiPrefix;
    const modifiedUrl = `${urlPrefix}/${url}`;

    if (body instanceof FormData) {
      headers = headers.delete('Content-Type');
    }
    return this.http.post<T>(modifiedUrl, body, {
      headers,
      responseType: responseType as 'json',
    });
  }

  /**
   * Generic PUT request
   * @param url Endpoint URL
   * @param body Request payload
   * @param isLodata Use Lodata prefix
   * @param headers Optional custom headers
   */
  put<T>(
    url: string,
    body: any,
    isLodata: boolean = true,
    headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    })
  ): Observable<T> {
    const urlPrefix = isLodata ? this.lodataPrefix : this.apiPrefix;
    const modifiedUrl = `${urlPrefix}/${url}`;
    return this.http.put<T>(modifiedUrl, body, { headers });
  }

  /**
   * Generic DELETE request
   * @param url Endpoint URL
   * @param isLodata Use Lodata prefix
   * @param headers Optional custom headers
   */
  delete<T>(
    url: string,
    isLodata: boolean = true,
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<T> {
    const urlPrefix = isLodata ? this.lodataPrefix : this.apiPrefix;
    const modifiedUrl = `${urlPrefix}/${url}`;
    return this.http.delete<T>(modifiedUrl, { headers });
  }

  /**
   * Utility function to log messages
   * @param message Message to log
   */
  log(message: string): void {}
}
