import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/select";

interface PriceData {
  name: string,
  price: string
}

@Component({
  selector: 'app-price-change-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    FormsModule,
    MatButton,
    MatInput,
    MatDialogClose,
    MatLabel
  ],
  templateUrl: './price-change-dialog.component.html',
  styleUrl: './price-change-dialog.component.scss'
})
export class PriceChangeDialogComponent {
  constructor(public dialogRef: MatDialogRef<PriceChangeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: PriceData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
