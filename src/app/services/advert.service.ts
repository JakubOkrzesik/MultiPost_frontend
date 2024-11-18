import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {catchError, filter, Observable, take, tap} from "rxjs";
import {Coordinates} from "../models/Coordinates";
import {ConfigService} from "./config.service";
import {ErrorMsgService} from "./error-msg.service";

@Injectable({
  providedIn: 'root'
})
export class AdvertService {

  constructor(private http: HttpClient, private configService: ConfigService, private errorMsgService: ErrorMsgService) {
    this.configService.ip$.pipe(
      filter(ip => !!ip),
      take(1),
      tap(ip => {
      if (ip) {
        this.baseUrl = `${ip}:8080/api/v1`
      }
    })).subscribe()
  }

  private baseUrl: string | undefined;
  private separator = /\s+/gmu;

  postAdvert(json: object): Observable<any> {
    const headers = this.getAuthHeaders()
    return this.http.post(`${this.baseUrl}/advert/create`, json, {observe: "body", responseType: "json", headers: headers})
  }

  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': "Bearer " + String(localStorage.getItem("jwtToken")) });
  }

  // Getting olx location from coordinates obtained from the dropdown google suggest form
  getLocationID(coordinates: Map<string, number | undefined>): Observable<Coordinates> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('lat', coordinates.get("lat")?.toFixed(6)!)
      .set('lng', coordinates.get("lng")?.toFixed(6)!);
    const url = `${this.baseUrl}/olx/location`;
    return this.http.post<Coordinates>(url, params, {observe: "body", responseType: "json", headers: headers})
  }

  deleteAdvert(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/advert/delete/${id}`;
    return this.http.delete(url, {observe: "body", responseType: "json", headers: headers})
  }

  changePrice(id: string, price: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/advert/${id}/price?newprice=${price}`
    return this.http.patch(url, null, {observe: "body", responseType: "json", headers: headers});
  }

  minWords(min: number, seperator: string | RegExp = this.separator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Check that the control has a value and if that value is a string.
      if (control.value && typeof control.value === 'string') {
        // Remove any leading and trailing whitespace
        const value = control.value.trim();
        const words = value.split(seperator);
        const actual = words.length;
        if (actual < min) {
          return { minword: { min, actual } };
        }
      }
      return null;
    };
  }

  exactLength(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (control.value && typeof control.value === 'number') {
        const currentLength = value.toString().length
        if (currentLength !== length) {
          return { lengthError: { length, currentLength } };
        }
      }

      return null;
    };
  }

  precisionValidator(precision: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Let the required validator handle empty values
      }

      if (!precision) {
        precision = 0;
      }

      // Check precision
      const decimalPart = value.toString().split('.')[1];
      if (decimalPart && decimalPart.length > precision) {
        return { 'tooManyDecimalPlaces': { value, precision: precision } };
      }

      return null;
    };
  }

  getUserAdverts() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/advert/user_adverts`, {observe: "body", responseType: "json", headers: headers})
  }
}
