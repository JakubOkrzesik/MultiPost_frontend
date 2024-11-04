import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  ip: any;

  constructor(private http: HttpClient) {}

  loadConfig() {
    this.http.get<any>('/assets/config.json', {observe: "body", responseType: "json"}).subscribe({
      next: config => {
        this.ip = config.ip;
        this.loadGoogleApi(config.google_api_key);
      },
      error: () => console.log("An error occured")
    })
  }

  private loadGoogleApi(key: string) {
    let chatScript = document.createElement("script");
    chatScript.type = "text/javascript";
    chatScript.async = true;
    chatScript.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    document.body.appendChild(chatScript);
  }
}
