import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  baseUrl: string = 'http://localhost:8080/api/v1';
  callbackUrl: string = 'https://7104-77-255-158-200.ngrok-free.app'

  constructor() {}
}
