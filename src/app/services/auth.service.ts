import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ConfigService} from "./config.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private configService: ConfigService, private _snackBar: MatSnackBar) {
    this.configService.ip$.subscribe(ip => {
      if (ip) {
        this.baseUrl = `${ip}:8080`
      }
    })
  }

  private baseUrl: string | undefined;

  loginSubmit(email: string, password: string): void {
    const formData = { email, password };
    this.http.post<any>(`${this.baseUrl}/auth/authenticate`, formData, { observe: "body", responseType: "json" }).subscribe(response => {
      if (response.token) {
        localStorage.setItem("jwtToken", response.token);
        this._snackBar.open("Login successful", "Ok")
        this.router.navigate(["/dashboard"]);// logged in popup
      }
      else {
        this._snackBar.open(response.message, "Ok")
      }
      }
    );
  }

  registerSubmit(email: string, password: string, firstname: string, lastname: string) {
    const formData = { email, password, firstname, lastname }
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
