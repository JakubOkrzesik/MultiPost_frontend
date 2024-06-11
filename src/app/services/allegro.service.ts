import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdvertService} from "./advert.service";
import {GlobalService} from "./global.service";

@Injectable({
  providedIn: 'root'
})
export class AllegroService {


  constructor(private http: HttpClient, private fb: FormBuilder, private advertService: AdvertService, private globalService: GlobalService) { }

  private baseUrl = this.globalService.baseUrl;

  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': "Bearer " + String(localStorage.getItem("jwtToken")) });
  }

  // Building forms for required fields that are not provided within the product structure
  getAllegroMissingParams(requiredParams: any[], productParams: any[]): [FormGroup, any[], Map<any, any>] {
    const group: any = {}
    const productParamIds = new Set(productParams.map(param => param.id));
    const missingParams: any[] = []
    const missingParamsMap = new Map()

    requiredParams.forEach(requiredParam => {
      if (requiredParam.required && !productParamIds.has(requiredParam.id)) {
        if (requiredParam.type === "float" || requiredParam.type == "integer") {
          group[requiredParam.id] = [null, [Validators.required, Validators.min(requiredParam.restrictions.min), Validators.max(requiredParam.restrictions.max), this.advertService.precisionValidator(requiredParam.restrictions.precision)]];
        } else if (requiredParam.type === "string") {
          group[requiredParam.id] = ["", [Validators.required, this.advertService.minWords(requiredParam.restrictions.allowedNumberOfValues)]];
        } else {
          group[requiredParam.id] = ["", [Validators.required]]
        }
        missingParams.push(requiredParam);
        // parameters can be either product params or offer params and are passed in different parts of the request
        // so it's necessary to store the relevant data about them
        missingParamsMap.set(requiredParam.id, requiredParam);
      }})
    console.log(missingParamsMap)
    return [this.fb.group(group), missingParams, missingParamsMap];
  }

  // Allegro api
  // directly searches for a product using its GTIN number
  allegroGtinSearch(GTIN: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/allegro/product/search/${GTIN}`;
    return this.http.get(url, {observe: "body", responseType: "json", headers: headers})
  }
  // searches for categories based on the user's query
  allegroCategorySearch(phrase: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/allegro/category/suggestion?phrase=${phrase}`;
    return this.http.get(url, {observe: "body", responseType: "json", headers: headers})
  }
  // the result from category search is paired with user query and used to search for a product
  allegroQuerySearch(phrase: string, id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/allegro/product/suggestion?phrase=${phrase}&id=${id}`;
    return this.http.get(url, {observe: "body", responseType: "json", headers: headers})
  }

  getAllegroProductbyID(productId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/allegro/product/${productId}`;
    return this.http.get(url, {observe: "body", responseType: "json", headers: headers})
  }

  getAllegroCategoryParams(categoryID: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/allegro/category/${categoryID}/params`;
    return this.http.get(url, {observe: "body", responseType: "json", headers: headers});
  }

  allegroAuth(code: any) {
    const headers = this.getAuthHeaders()
    const url = `${this.baseUrl}/service_auth/allegro?code=${code}`;
    return this.http.get(url, {observe: "body", headers: headers})
  }

  getAdvert(id: any) {
    const headers = this.getAuthHeaders()
    const url = `${this.baseUrl}/allegro/advert/${id}`;
    return this.http.get(url, {observe: "body", headers: headers})
  }
}
