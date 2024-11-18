import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorMsgService {

  private readonly config: MatSnackBarConfig;

  constructor(private _snackBar: MatSnackBar, private router: Router) {
    this.config = new MatSnackBarConfig();
    this.config.duration = 3000;
    this.config.verticalPosition = 'bottom';
    this.config.horizontalPosition = 'center';
  }

  displayErrorMessage(err: any, redirect?: string) {

    this._snackBar.open(err.message, 'Ok', this.config);

    if (redirect!=undefined) {
      this.router.navigate([redirect]);
    }
  }
}
