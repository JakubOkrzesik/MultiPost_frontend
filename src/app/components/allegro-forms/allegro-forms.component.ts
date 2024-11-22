import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {CommonModule, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatError, MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {AllegroService} from "../../services/allegro.service";
import {MatCard, MatCardContent} from "@angular/material/card";
import {catchError, filter, of, Subscription, switchMap, tap} from "rxjs";
import {MatInput} from "@angular/material/input";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {ErrorMsgService} from "../../services/error-msg.service";

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
    NgxMatSelectSearchModule,
    MatError
  ],
  templateUrl: './allegro-forms.component.html',
  styleUrl: './allegro-forms.component.scss'
})
export class AllegroFormsComponent implements OnDestroy, OnInit {
  // need to set up better handling of subscriptions

  @Output() allegroFormDataEvent = new EventEmitter<any>();

  allegroForm: FormGroup;
  isReadOnly: boolean = false;
  productName: string = '';
  categoryData: any[] = [];
  productArray: any[] = [];
  private requiredParamsArray: any[] = [];
  private productParameters: any[] = [];
  missingParams: any[] = [];
  private subscriptions: Subscription[] = [];
  private missingParamsMap!: Map<any, any>;

  constructor(private allegroService: AllegroService, private errorService: ErrorMsgService) {
    this.allegroForm = new FormGroup({
      productQuery: new FormControl(''),
      GTIN: new FormControl('', [Validators.minLength(12), Validators.maxLength(12)]),
      category: new FormControl('', [Validators.required]),
      productId: new FormControl('', [Validators.required]),
      isGTINActive: new FormControl(false),
      paramForms: new FormGroup({})
    })
  }

  ngOnInit(): void {
    // setup subscriptions for categoryID, productID and form validation
    this.setupCategoryIDSubscription();
    this.setupProductIDSubscription();
    this.setupFormValidationSubscription();
  }

  ngOnDestroy(): void {
    this.deleteSubscriptions();
  }

  private setupCategoryIDSubscription() {
    this.allegroForm.get('category')?.valueChanges.pipe(filter(categoryId => !this.allegroForm.controls['isGTINActive'].value && categoryId != '' && categoryId != null),
      tap(() => {
          this.productParameters = [];
          this.missingParams = [];
          // in order to ensure that the correct param forms are displayed also that the form stays invalid will have to do for now
      }),
      switchMap((categoryId) => this.allegroService.allegroQuerySearch(this.allegroForm.get('productQuery')?.value, categoryId).pipe(tap(response => {
        this.productArray = response.products/*.filter((product: any) => product.publication.status === "LISTED")*/;
      }))),
      catchError((err) => {
        console.log(err)
        this.errorService.displayErrorMessage(err);
        return of(null);
      })).subscribe()
  }

  private setupProductIDSubscription() {
    this.allegroForm.controls['productId']?.valueChanges.pipe(filter(result => !this.allegroForm.controls['isGTINActive'].value && result != '' && result != null),
      switchMap((result) => this.allegroService.getAllegroProductbyID(result).pipe(tap(productData => {
        this.productParameters = productData.parameters;
      }),
        switchMap(() => this.generateParamForms()))),
      catchError((err) => {
        this.errorService.displayErrorMessage(err);
        console.log(err)
        return of(null);
      })).subscribe()
  }

  private searchProductByGTIN() {
    // searches product by GTIN number and generates forms according to the productId
    const gtinValue = this.allegroForm.controls['GTIN'].value;
    this.allegroService.allegroGtinSearch(gtinValue).pipe(tap(response => {
        const product = response.products[0]
        this.allegroForm.controls['productId'].setValue(product.id)
        this.allegroForm.controls['category'].setValue(product.category.id)
        this.productName = product.name;
        // makes the GTIN form disabled - user needs to press the edit button to edit the GTIN number
        this.isReadOnly = true;
        this.productParameters = product.parameters;
      }),
      switchMap(() => this.generateParamForms()),
      catchError(err => {
        this.errorService.displayErrorMessage(err);
        return of(null);
      })).subscribe({
      complete: () => console.log("Category information fetched")
    });
  }

  private searchProductByQuery() {
    // searches for a product via a user query
    const productQuery = this.allegroForm.controls['productQuery'].value;
    this.allegroService.allegroCategorySearch(productQuery).pipe(
      tap(response => {
        this.productName = productQuery;
        this.isReadOnly = true;
        this.categoryData = response.matchingCategories;
      }),
      catchError(err => {
        this.errorService.displayErrorMessage(err);
        return of(null);  // Handle the error and return a fallback value
      })
    ).subscribe({
      complete: () => console.log("Request completed")
    });
  }


  private generateParamForms() {
    const categoryId = this.allegroForm.get('category')?.value
    return this.allegroService.getAllegroCategoryParams(categoryId).pipe(tap(response => {
      // searching for only the required parameters
      this.requiredParamsArray = response.parameters.filter((param: any) => param.required);
      // comparing the product params to category params and selecting the ones that are missing
      const [formGroup, missingParams, missingParamsMap] = this.allegroService.getAllegroMissingParams(this.requiredParamsArray, this.productParameters);
      this.allegroForm.setControl('paramForms', formGroup);
      this.missingParams = missingParams;
      this.missingParamsMap = missingParamsMap
      // copy of the original values because if the dictionary belongs to a child component it will be getting updated
      this.missingParams.forEach(field => field.originalDictionary = field.dictionary);
      this.setupParamFormSubscriptions();
    }))
  }

  // needs reevaluation
  // does not work when a child param is not in the product and the parent is
  private setupParamFormSubscriptions() {
    this.deleteSubscriptions();
    this.missingParams.forEach(field => {

      const parentId = field.options.dependsOnParameterId;

      // needs to search for the parent params in the product params first
      if (!parentId || this.searchForParentParamsInProduct(field)) {
        return;
      }

      const subscription = this.allegroForm.get('paramForms')?.get(parentId)?.valueChanges.subscribe(parentIdValue => {
        field.dictionary = this.updateDependentOptions(field, parentIdValue);
      });

      if (subscription) {
        this.subscriptions.push(subscription);
      }
    });
  }

  private searchForParentParamsInProduct(field: any): boolean {
    const parentId = field.options.dependsOnParameterId;

    return this.productParameters.some(param => {
      if (param.id === parentId) {

        field.dictionary = this.updateDependentOptions(field, param.valuesIds); // Call your function here
        return true;
      }
      return false;
    });
  }

  // is responsible for updating data of the dependent form options - some form entries are dependent on parent value for example Manufacturer - Apple, product - Iphone 12
  // this function ensures only correct child options are visible
  // functions serves both values entered via the form and values already assigned to the product
  private updateDependentOptions(field: any, parentIdValue: string | string[]) {
    if (!field.originalDictionary) {
      return [];
    }

    return field.originalDictionary.filter((dictEntry: any) => {
      if (typeof parentIdValue == "string") {
        return dictEntry.dependsOnValueIds.includes(parentIdValue);
      }
      return parentIdValue.some(value => dictEntry.dependsOnValueIds.includes(value));
    }
    );
  }

  private setupFormValidationSubscription() {
    this.allegroForm.statusChanges.pipe(
      tap((status) => {
        if (status === "VALID" && this.missingParams.length != 0) {
          this.emitAllegroFormData();
        } else {
          this.emitNullValue();
        }
      })
    ).subscribe();
  }

  private emitAllegroFormData() {
    const productParameters: any[] = []
    const offerParameters: any[] = []
    Object.keys((this.allegroForm.get('paramForms') as FormGroup).controls).forEach((id) => {
      let entry;
      // need to add support for range values
      if (this.missingParamsMap.get(id).type == "dictionary") {
        entry = {
          id: id,
          valuesIds: [this.allegroForm.get('paramForms')?.get(id)?.value],
          values: [],
          rangeValue: null
        }
      } else {
        entry = {
          id: id,
          valuesIds: [],
          values: [this.allegroForm.get('paramForms')?.get(id)?.value],
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
      id: this.allegroForm.get('productId')?.value,
      productParameters: productParameters,
      offerParameters: offerParameters
    }
    this.allegroFormDataEvent.emit(allegroFormsData)
    console.log("VALID DATA EMITTED")
  }

  // consider the use of async pipe in observing the state of allegro form
  private emitNullValue() {
    this.allegroFormDataEvent.emit(null);
    console.log("INVALID DATA - EMITTING NULL VALUE");
  }

  // attached to the edit button resets the form
  resetFormState() {
    this.productName = '';
    this.isReadOnly = false;
    this.categoryData = [];
    this.productArray = [];
    this.missingParams = [];
    this.deleteSubscriptions();
    this.allegroForm.reset({
      isGTINActive: this.allegroForm.get('isGTINActive')?.value
    });
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

  private deleteSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  formRequirementCheck(fieldId: any) {
    return (this.allegroForm.get('paramForms') as FormGroup).controls[fieldId].hasError('required')
  }

  onSubmit() {
    const isGTINActive = this.allegroForm.controls['isGTINActive'].value
    if (isGTINActive) {
      this.searchProductByGTIN();
    } else {
      this.searchProductByQuery();
    }
  }
}
