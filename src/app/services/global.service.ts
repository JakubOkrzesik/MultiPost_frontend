import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  baseUrl: string = 'http://localhost:8080/api/v1';
  callbackUrl: string = 'http://localhost:4200'

  constructor() {}
}
