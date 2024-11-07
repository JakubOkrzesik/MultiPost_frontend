import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {OlxService} from "../../services/olx.service";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {AdvertService} from "../../services/advert.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {GoogleMapsModule} from "@angular/google-maps";

@Component({
  selector: 'app-olx-forms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    NgIf,
    NgForOf,
    MatInput,
    MatSelect,
    MatOption,
    MatLabel,
    MatCardHeader,
    MatCardTitle,
    MatButtonToggle,
    MatFormField,
    MatError,
    GoogleMapsModule
  ],
  templateUrl: './olx-forms.component.html',
  styleUrl: './olx-forms.component.scss'
})
export class OlxFormsComponent implements OnChanges, AfterViewInit{
  @Output() olxFormDataEvent = new EventEmitter<any>();
  @Input({required: true}) title!: string;

  public olxForms: FormGroup;
  public formFields: any[] = [];
  private olxCategoryID: any;
  private locationData: Map<string, number | undefined> = new Map();


  @ViewChild('inputField')
  inputField!: ElementRef;

  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor(private olxService: OlxService, private advertService: AdvertService) {
    this.olxForms = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, this.advertService.exactLength(9)]),
      location: new FormControl('', [Validators.required]),
      locationData: new FormControl(null, [Validators.required]),
      generatedControls: new FormGroup({})
    })
  }

  private generateOlxForms() {
    this.olxService.getCategorySuggestion(this.title).subscribe(categoryID => {
      this.olxCategoryID = categoryID
      this.olxService.getOLXCategoryAttributes(categoryID).subscribe(data => {
        this.formFields = data;
        const generatedControls = this.olxService.generateForm(this.formFields)
        console.log(this.formFields)
        this.olxForms.setControl('generatedControls', generatedControls);
      });
    })
  }

  clearOlxForms() {
    this.formFields = [];
    this.olxForms.setControl('generatedControls', new FormGroup({}));
  }

  private validFormWatcher() {
    this.olxForms.statusChanges.subscribe((response) => {
      if (response==="VALID") {
        const olxFormData = {
          ...this.olxForms.value,
          category_id: this.olxCategoryID,
          location: this.locationData
        }
        this.olxFormDataEvent.emit(olxFormData);
        console.log("OLX data emitted")
      } else {
        this.olxFormDataEvent.emit(null)
      }
    });
  }

  private locationWatcher() {
    this.olxForms.controls['location'].valueChanges.subscribe(value => {
      if (value=='') {
        console.log('Coordinates reset')
        this.olxForms.patchValue({
          locationData: null
        })
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title'] && this.title!=='') {
      this.generateOlxForms();
      console.log(this.olxForms.controls)
    } else {
      this.clearOlxForms();
    }
  }

  ngAfterViewInit(): void {
    this.validFormWatcher();
    this.locationWatcher()

    // Google maps autocomplete is used to aid the user with providing the location
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement, {
      types: ['(cities)'],
      componentRestrictions: { country: 'PL' } // Restrict to Poland
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place?.geometry && place.geometry.viewport) {
        this.locationData.set("lat", place.geometry.viewport.getCenter().lat());
        this.locationData.set("lng", place.geometry.viewport.getCenter().lng());
        this.olxForms.patchValue({
          locationData: this.locationData
        })
      } else if (place?.geometry && place.geometry.location) {
        // Fallback if viewport is not available
        this.locationData.set("lat", place.geometry.location.lat());
        this.locationData.set("lng", place.geometry.location.lng());
      }
    });
  }

  formRequirementCheck(field: any) {
    return (this.olxForms.get('generatedControls') as FormGroup).controls[field].hasError('required')
  }

  numericFormValidationErrors(field: any) {
    return field.validation.numeric && ((this.olxForms.get('generatedControls') as FormGroup).controls[field.code].hasError('min') || (this.olxForms.get('generatedControls') as FormGroup).controls[field.code].hasError('max'));
  }
}
