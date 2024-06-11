import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalService} from "./global.service";

@Injectable({
  providedIn: 'root'
})
export class OlxService {

  constructor(private http: HttpClient, private fb: FormBuilder, private globalService: GlobalService) {}

  private baseUrl = this.globalService.baseUrl;


  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': "Bearer " + String(localStorage.getItem("jwtToken")) });
  }

  // OLX Api
  // Flow of OLX forms -> category suggestion retrieved -> category attribs based on categoryID -> forms generated from the response
  getCategorySuggestion(title: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/olx/category?title=${title}`;
    return this.http.get(url, {observe: "body", responseType: "json", headers: headers})
  }

  getOLXCategoryAttributes(categoryID: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/olx/attribs`;
    const params = new HttpParams().set('categoryID', categoryID);
    return this.http.post(url, params, {observe: "body", responseType: "json", headers: headers})
  }

  generateForm(fields: any[]): FormGroup {
    const group: any = {};

    fields.forEach(field => {
      if (field.values.length > 0) {
        group[field.code] = ["", Validators.required];
      } else if (field.validation.numeric) {
        group[field.code] = [null, [Validators.required, Validators.min(field.validation.min), Validators.max(field.validation.max)]];
      } else {
        group[field.code] = ["", Validators.required];
      }
    });

    return this.fb.group(group);
  }

  olxAuth(code: any): Observable<any> {
    const headers = this.getAuthHeaders()
    const url = `${this.baseUrl}/service_auth/olx?code=${code}`;
    return this.http.get(url, {observe: "body", headers: headers})
  }

  getAdvert(id: any) {
    const headers = this.getAuthHeaders()
    const url = `${this.baseUrl}/olx/advert/${id}`;
    return this.http.get(url, {observe: "body", headers: headers})
  }
}
