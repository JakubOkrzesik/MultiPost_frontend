import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ImageUploadComponent} from "../image-upload/image-upload.component";
import {CommonModule} from "@angular/common";
import {AdvertService} from "../../services/advert.service";
import {LocationFormComponent} from "../location-form/location-form.component";
import {map, Observable, of} from "rxjs";
import {AllegroFormsComponent} from "../allegro-forms/allegro-forms.component";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {Attrib} from "../../models/Attrib";
import {OlxFormsComponent} from "../olx-forms/olx-forms.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {Image} from "../../models/Image";

@Component({
  selector: 'app-adverts-form',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUploadComponent, CommonModule, ImageUploadComponent, LocationFormComponent, AllegroFormsComponent, MatCard, MatCardContent, MatSlideToggle, OlxFormsComponent, MatButtonToggle],
  templateUrl: './adverts-form.component.html',
  styleUrl: './adverts-form.component.scss'
})
export class AdvertsFormComponent implements OnInit {

  public sharedForm: FormGroup;
  public allegroData: any;
  private imageUrls: string[] = [];
  title: string = '';
  public olxData: any;


  constructor(private advertService: AdvertService, private _snackBar: MatSnackBar, private router: Router) {
    this.sharedForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(70)]),
      desc: new FormControl('', [Validators.required, Validators.minLength(80), Validators.maxLength(9000)]),
      price: new FormControl('', [Validators.required]),
      imageUrls: new FormControl([], [Validators.required]),
      advertToggles: new FormGroup({
        olxToggle: new FormControl({value: true, disabled: true}),
        allegroToggle: new FormControl(false)
      })
    })
  }

  ngOnInit(): void {
    // checks the API authentication status
    const olxAuth = localStorage.getItem("olxAuth") === "true";
    const allegroAuth = localStorage.getItem("allegroAuth") === "true";

    if (!olxAuth || !allegroAuth) {
      this.router.navigate(['dashboard']);
      this._snackBar.open("You need to be authenticated on both services to use this feature", "Ok");
      return;
    }

  }


  openSnackBar(message: string) {
    this._snackBar.open(message, "Ok");
  }

  onTitleBlur() {
    if (this.sharedForm.controls['title'].valid) {
      this.title = this.sharedForm.controls['title'].value
    }
  }

  goBack() {
    this.router.navigate(['user-adverts'])
  }

  handleImageEvent($event: string) {
    this.imageUrls.push($event)
    this.sharedForm.get('imageUrls')?.setValue(this.imageUrls)
  }

  handleAllegroFormEvent($event: any) {
    this.allegroData = $event;
  }

  handleOlxFormEvent($event: any) {
    this.olxData = $event
  }

  collectFormValues(): Observable<any> {
    const olxToggle = this.sharedForm.get('advertToggles')?.get('olxToggle')?.value;
    const allegroToggle = this.sharedForm.get('advertToggles')?.get('allegroToggle')?.value;

    const advert: any = {
      name: this.sharedForm.controls['title']?.value,
      price: this.sharedForm.controls['price']?.value,
      platforms: {
        olxToggle: olxToggle,
        allegroToggle: allegroToggle
      },
    };

    if (allegroToggle) {
      advert.allegroData = {
        productSet: [{
          product: {
            id: this.allegroData.id,
            images: this.imageUrls,
            parameters: this.allegroData.productParameters
          }
        }],
        name: this.sharedForm.controls['title']?.value,
        parameters: this.allegroData.offerParameters,
        sellingMode: {
          price: {
            amount: this.sharedForm.controls['price']?.value,
            currency: "PLN"
          }
        },
        stock: {
          available: 1
        }
      };
    }

    if (olxToggle) {
    // needs changing location request would be better handled on the backend
    return this.advertService.getLocationID(this.olxData.location).pipe(
      map(response => {

          const attributes: Attrib[] = Object.entries(this.olxData.generatedControls).map(([key, value]) => ({
            code: key,
            value: value as string
          }));

          const images: Image[] = this.imageUrls.map(image => ({
            url: image
          }));

          advert.olxData = {
            title: this.sharedForm.controls['title']?.value,
            description: this.sharedForm.controls['desc']?.value,
            category_id: this.olxData.category_id,
            advertiser_type: "private",
            contact: {
              name: this.olxData.name,
              phone: this.olxData.phone.valueAsString
            },
            location: response,
            images: images,
            price: {
              value: this.sharedForm.controls['price']?.value,
              currency: "PLN",
              negotiable: false
            },
            attributes: attributes
          };
          return { advert };
        }));
    }
    // return advert without olx data
    return of({ advert });
  }

  onSubmit() {
      this.collectFormValues().subscribe(advert => {
        console.log(advert)
        /*this.advertService.postAdvert(advert).subscribe({
          next: (response) => {
            if (response.status===200) {
              this.openSnackBar(response.message);
              this.router.navigate(['user-adverts'])
            }
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar("Error while posting advert. Fill out your forms once again");
            this.reloadComponent();
          }
      })*/})
  }

  private reloadComponent() {
    // Assuming you are on the path '/allegro-forms'
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/form']);
    });
  }

  submitButtonCheck() {
    return !this.sharedForm.valid || ((this.sharedForm.get('advertToggles.allegroToggle')?.value && this.allegroData==null) || (this.sharedForm.get('advertToggles.olxToggle')?.value && this.olxData==null))
  }
}
