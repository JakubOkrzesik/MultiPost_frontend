import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {GlobalService} from "./global.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService, private _snackBar: MatSnackBar) {}

  private baseUrl = this.globalService.baseUrl;

  loginSubmit(email: string, password: string): void {
    const formData = { email, password };
    this.http.post<{token: string}>(`${this.baseUrl}/auth/authenticate`, formData, { observe: "body", responseType: "json" }).subscribe(response => {
      console.log(response);
      if (response.token) {
        localStorage.setItem("jwtToken", response.token);
        this._snackBar.open("Login successful", "Ok")
        this.router.navigate(["/dashboard"]);// logged in popup
      }
      else {
        this._snackBar.open("An error occurred while trying to log in", "Ok")
        console.log("Token not saved");
      }
      }
    );
  }

  registerSubmit(email: string, password: string) {
    const formData = { email, password }
    this.http.post<any>(`${this.baseUrl}/auth/register`, formData, { observe: "body", responseType: "json" }).subscribe(response =>
      // Communicado using the response's message
      {
        this._snackBar.open(response.message, "Ok")
        if (response.status===200) {
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  private getAuthHeaders() {
    return new HttpHeaders({ 'Authorization': "Bearer " + String(localStorage.getItem("jwtToken")) });
  }

  logOut() {
    localStorage.removeItem("jwtToken");
    this.router.navigate(["/"])
  }

  getUserDetails(): Observable<any> {
    const url = `${this.baseUrl}/user/get`
    return this.http.get(url, {observe: "body", responseType:"json", headers: this.getAuthHeaders()})
  }
}
