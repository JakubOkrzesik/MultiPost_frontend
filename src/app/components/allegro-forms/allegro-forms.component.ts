import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {CommonModule, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {AllegroService} from "../../services/allegro.service";
import {MatCard, MatCardContent} from "@angular/material/card";
import {Subscription} from "rxjs";
import {MatInput} from "@angular/material/input";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

@Component({
  selector: 'app-allegro-forms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckbox,
    NgIf,
    CommonModule,
    MatButton,
    MatTooltip,
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
    MatCard,
    MatCardContent,
    MatInput,
    NgxMatSelectSearchModule
  ],
  templateUrl: './allegro-forms.component.html',
  styleUrl: './allegro-forms.component.scss'
})
export class AllegroFormsComponent implements OnDestroy {
  // need to set up better handling of subscriptions

  @Output() allegroFormDataEvent = new EventEmitter<any>();

  allegroForm: FormGroup;
  isReadOnly: boolean = false;
  productId: string = '';
  productName: string = '';
  categoryData: any[] = [];
  productArray: any[] = [];
  private categoryId: any;
  private requiredParamsArray: any[] = [];
  private productParameters: any[] = [];
  allegroParamForm: FormGroup = new FormGroup({});
  missingParams: any[] = [];
  private subscriptions: Subscription[] = [];
  private missingParamsMap!: Map<any, any>;

  constructor(private allegroService: AllegroService) {
    this.allegroForm = new FormGroup({
      productQuery: new FormControl(''),
      GTIN: new FormControl('', [Validators.minLength(12), Validators.maxLength(12)]),
      category: new FormControl(''),
      productId: new FormControl(''),
      isGTINActive: new FormControl(false),
      paramForms: new FormGroup({})
    })
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private searchProductByGTIN() {
    // searches product by GTIN number and generates forms according to the productId
    this.allegroService.allegroGtinSearch(this.allegroForm.controls['GTIN'].value).subscribe(response => {
      const product = response.products[0]
      this.productId = product.id;
      this.categoryId = product.category.id;
      this.productName = product.name;
      // makes the GTIN form disabled - user needs to press the edit button to edit the GTIN number
      this.isReadOnly = true;
      this.productParameters = response.parameters;
      this.generateParamForms()
    });
  }

  private searchProductbyQuery() {
    // searches for a product via a user query
    const productQuery = this.allegroForm.controls['productQuery'].value;
    this.allegroService.allegroCategorySearch(productQuery).subscribe(response => {
      this.productName = productQuery;
      this.isReadOnly = true;
      this.categoryData = response.matchingCategories;
      // produces an array of matching categories
      // waiting for the user to select a category
      this.watchCategoryID()
      // waiting for the user to select a product
      this.allegroForm.get('productId')?.valueChanges.subscribe(productID => {
        this.productId = productID;
        // getting product's details
        this.generateParamForms();
      })
    })
  }

  private watchCategoryID() {
    this.allegroForm.get('category')?.valueChanges.subscribe(categoryId => {
      this.categoryId = categoryId
      this.productParameters = [];
      this.missingParams = [];
      this.allegroForm.setControl('paramForms', new FormGroup({temp: new FormControl('', [Validators.required])}));
      // in order to ensure that the correct param forms are displayed also that the form stays invalid will have to do for now
      this.allegroService.allegroQuerySearch( this.allegroForm.get('productQuery')?.value, this.categoryId).subscribe(response => {
        // products labeled as "LISTED" do not require further approval from allegro and can be immediately posted
        this.productArray = response.products.filter((product: any) => product.publication.status==="LISTED");
      })
    })
  }

  private generateParamForms() {
    this.allegroService.getAllegroProductbyID(this.productId).subscribe(response => {
      this.productParameters = response.parameters;
      // in order to get only the required params the product params need to be compared to the required category params
      // getting category params
      this.allegroService.getAllegroCategoryParams(this.categoryId).subscribe(response => {
        // searching for only the required parameters
        this.requiredParamsArray = response.parameters.filter((param: any) => param.required);
        const [formGroup, missingParams, missingParamsMap] = this.allegroService.getAllegroMissingParams(this.requiredParamsArray, this.productParameters);
        this.allegroParamForm = formGroup;
        this.allegroForm.setControl('paramForms', this.allegroParamForm);
        this.missingParams = missingParams;
        console.log(this.missingParams)
        this.missingParamsMap = missingParamsMap
        // copy of the original values because if the dictionary belongs to a child component it will be getting updated
        this.missingParams.forEach(field => field.originalDictionary = field.dictionary);
        this.setupParamFormSubscriptions();
      })
    })
  }

  private setupParamFormSubscriptions() {
    this.missingParams.forEach(field => {
      const parentId = field.options.dependsOnParameterId;
      if (parentId) {
        const subscription = this.allegroParamForm.get(parentId)?.valueChanges.subscribe(parentIdValue => {
          field.dictionary = this.updateDependentOptions(field, parentIdValue);
        });
        if (subscription) {
          this.subscriptions.push(subscription);
        }
      }
    });

    // emitting the data to the main form component if the form is valid
    let allegroFormSubscription = this.allegroForm.statusChanges.subscribe((response) => {
      if (response==="VALID") {
        const productParameters: any[] = []
        const offerParameters: any[] = []
        Object.keys(this.allegroParamForm.controls).forEach((id) => {
          let entry;
          // need to add support for range values
          if (this.missingParamsMap.get(id).type=="dictionary") {
            entry = {
              id: id,
              valuesIds: [this.allegroParamForm.controls[id].value],
              values: [],
              rangeValue: null
            }
          } else {
            entry = {
              id: id,
              valuesIds: [],
              values: [this.allegroParamForm.controls[id].value],
              rangeValue: null
            };
          }

          if (this.missingParamsMap.get(id).options.describesProduct) {
            productParameters.push(entry)
          } else {
            offerParameters.push(entry)
          }
        })
        const allegroFormsData = {
          id: this.productId,
          productParameters: productParameters,
          offerParameters: offerParameters
        }
        console.log(allegroFormsData)
        this.allegroFormDataEvent.emit(allegroFormsData)
      } else {
        this.allegroFormDataEvent.emit(null)
        console.log("data emitted")
      }
    });

    this.subscriptions.push(allegroFormSubscription);
  }

  // attached to the edit button resets the form
  resetFormState() {
    this.productId = '';
    this.productName = '';
    this.isReadOnly = false;
    this.categoryData = [];
    this.productArray = [];
    this.missingParams = [];
    this.categoryId = '';
    this.ngOnDestroy();
    // temporary solution needs an overhaul
    this.allegroFormDataEvent.emit(null)
    console.log("data emitted")
  }

  // is responsible for updating data of the dependent form options - some form entries are dependent on parent value for example Manufacturer - Apple, product - Iphone 12
  // this functions ensures only correct child options are visible
  private updateDependentOptions(field: any, parentIdValue: any) {
    if (!field.originalDictionary) {
      return [];
    }

    return field.originalDictionary.filter((dictEntry: any) =>
      dictEntry.dependsOnValueIds.includes(parentIdValue)
    );
  }



  onSubmit() {
    const isGTINActive = this.allegroForm.controls['isGTINActive'].value
    if (isGTINActive) {
      this.searchProductByGTIN();
    }
    else{
      this.searchProductbyQuery();
    }
  }

  conditionalToolTip(): string {
    if (this.productName) {
      if (!this.allegroForm.controls['isGTINActive'].value) {
        return "To edit the product query press the edit button";
      }
      return "To edit the GTIN number press the edit button";
    }
    return '';
  }
}
