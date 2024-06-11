import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";
import {GoogleMapsModule} from "@angular/google-maps";
import {LocationFormComponent} from "./components/location-form/location-form.component";
import {MatButton, MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, GoogleMapsModule, LocationFormComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MultiPost';
}
