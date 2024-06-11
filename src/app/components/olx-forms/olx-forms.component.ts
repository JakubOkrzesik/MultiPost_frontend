import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {OlxService} from "../../services/olx.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdvertService} from "../../services/advert.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {LocationFormComponent} from "../location-form/location-form.component";
import {NgForOf, NgIf} from "@angular/common";
import {distinctUntilChanged} from "rxjs";
import {MatInput, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {Router} from "@angular/router";

@Component({
  selector: 'app-olx-forms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    LocationFormComponent,
    NgIf,
    NgForOf,
    MatInput,
    MatSelect,
    MatOption,
    MatLabel,
    MatCardHeader,
    MatCardTitle,
    MatButtonToggle
  ],
  templateUrl: './olx-forms.component.html',
  styleUrl: './olx-forms.component.scss'
})
export class OlxFormsComponent implements OnChanges, AfterViewInit{
  @Output() olxFormDataEvent = new EventEmitter<any>();
  @Input({required: true}) title!: string;

  public olxForms: FormGroup;
  public formFields: any[] = [];
  private coordinates = new Map<string, number | undefined>();
  private olxCategoryID: any;

  constructor(private olxService: OlxService, private advertService: AdvertService) {
    this.olxForms = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, this.advertService.exactLength(9)]),
      generatedControls: new FormGroup({})
    })
  }


  handleLocationEvent($event: Map<string, number | undefined>) {
    this.coordinates = $event;
  }

  private generateOlxForms() {
    this.olxService.getCategorySuggestion(this.title).subscribe(categoryID => {
      this.olxCategoryID = categoryID
      this.olxService.getOLXCategoryAttributes(categoryID).subscribe(data => {
        this.formFields = data;
        const generatedControls = this.olxService.generateForm(this.formFields)
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
      if (response==="VALID" && this.coordinates.size!==0) {
        const olxFormData = {
          ...this.olxForms.value,
          category_id: this.olxCategoryID,
          location: this.coordinates
        }
        this.olxFormDataEvent.emit(olxFormData);
        console.log("OLX data emitted")
      } else {
        this.olxFormDataEvent.emit(null)
      }
    });
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
  }

}
