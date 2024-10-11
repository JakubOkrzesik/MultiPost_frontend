import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";
import {MatAnchor, MatButton} from "@angular/material/button";
import {AdvertService} from "../../services/advert.service";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {PriceChangeDialogComponent} from "../price-change-dialog/price-change-dialog.component";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-advert-element',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatAnchor,
    MatCardTitle,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    MatDialogActions,
    MatFormField,
    FormsModule,
    MatInput,
    NgIf,
    MatCardFooter
  ],
  templateUrl: './advert-element.component.html',
  styleUrl: './advert-element.component.scss'
})
export class AdvertElementComponent implements OnInit{
  @Input({required: true}) advert: any;
  @Output() notifyParent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private advertService: AdvertService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    console.log(this.advert)
  }
  // https://www.olx.pl/d/mojolx
  getOlxUrl(id: any) {
    window.open(`https://www.olx.pl/d/${id}`, "_blank");
  }
  // https://allegro.pl.allegrosandbox.pl/moje-allegro/sprzedaz/obsluga-ofert/moj-asortyment
  getAllegroUrl(id: any) {
    window.open(`https://allegro.pl.allegrosandbox.pl/oferta/${id}`, "_blank");
  }

  openPriceDialog(): void {
    const dialogRef = this.dialog.open(PriceChangeDialogComponent, {
      data: { price: this.advert.price, name: this.advert.listingName },
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close({ noAction: true }); // pass a result to close
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && !result.noAction) { // handle the case when the dialog is closed by user action
        this.submitPrice(this.advert.id, result);
      }
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close({ noAction: true }); // pass a result to close
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && !result.noAction) { // handle the case when the dialog is closed by user action
        this.submitDelete(this.advert.id);
      }
    });
  }

  submitPrice(id: string, price: number) {
    if (price!=null) {
      this.advertService.changePrice(id, price).subscribe(response => {
        this._snackBar.open(response.message, "OK");
        if (response.status==200) {
          this.notifyParent.emit();
        }
      })
    }
  }

  submitDelete(id: string) {
    this.advertService.deleteAdvert(id).subscribe(response => {
      console.log(response.status)
      if (response.status==200) {
        this._snackBar.open(response.message, "OK")
        this.notifyParent.emit()
      }
    })
  }

  conflictCheck(advert: any) {
    return advert.olxState=="REMOVED_BY_USER" && advert.allegroState=="ENDED";
  }

  olxStatusTextGenerator(olxState: any): string {
    switch (olxState) {
      case 'LIMITED':
        return 'You need to buy advert packets for the listing to be posted'
      case 'ACTIVE':
        return 'Advert active'
      case 'NEW':
        return 'Advert awaiting activation'
      case 'REMOVED_BY_USER':
        return 'Advert inactive'
      case null:
        return 'Advert not posted on OLX'
      default:
        return 'Check advert on OLX'
    }
  }

  allegroStatusTextGenerator(allegroState: any): string {
    switch (allegroState) {
      case 'ACTIVE':
        return 'Advert active'
      case 'INACTIVE':
        return 'Advert awaiting activation'
      case 'ACTIVATING':
        return 'Advert awaiting activation'
      case 'ENDED':
        return 'Advert inactive'
      case null:
        return 'Advert not posted on Allegro'
      default:
        return 'Check advert on Allegro'
    }
  }
}
