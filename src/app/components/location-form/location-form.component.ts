import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";


@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    FormsModule,
    GoogleMapsModule,
    MatFormField,
    MatInput
  ],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss'
})
export class LocationFormComponent implements AfterViewInit {

  @Output() locationEvent = new EventEmitter<Map<string, number | undefined>>();

  locationData: Map<string, number | undefined> = new Map();

  @ViewChild('inputField')
  inputField!: ElementRef;

  autocomplete: google.maps.places.Autocomplete | undefined;

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement)

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      this.locationData.set("lat", place?.geometry?.viewport?.getCenter().lat());
      this.locationData.set("lng", place?.geometry?.viewport?.getCenter().lng());
      this.locationEvent.emit(this.locationData);
    })
  }
}
