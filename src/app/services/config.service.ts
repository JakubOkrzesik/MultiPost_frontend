import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, of} from "rxjs";
import {Config} from "../models/Config";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private ipSubject = new BehaviorSubject<string | null>(null);
  ip$ = this.ipSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig() {
    this.http.get<Config>('/assets/config.json', {observe: "body", responseType: "json"}).subscribe({
      next: config => {
        this.loadGoogleApi(config.google_api_key);
        this.ipSubject.next(config.ip_address);
        console.log(config.ip_address)
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
