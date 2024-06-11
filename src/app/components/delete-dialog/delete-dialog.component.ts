import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
