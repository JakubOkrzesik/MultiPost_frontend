import {AfterViewInit, Component} from '@angular/core';
import {AdvertService} from "../../services/advert.service";
import {NgForOf, NgIf} from "@angular/common";
import {AdvertElementComponent} from "../advert-element/advert-element.component";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-user-adverts-list',
  standalone: true,
  imports: [
    NgForOf,
    AdvertElementComponent,
    MatButtonToggle,
    MatIcon,
    MatFabButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgIf
  ],
  templateUrl: './user-adverts-list.component.html',
  styleUrl: './user-adverts-list.component.scss'
})
export class UserAdvertsListComponent implements AfterViewInit{

  advertsArray!: any[]

  constructor(private advertService: AdvertService, private router: Router) {
  }

  goBack() {
    this.router.navigate(['dashboard'])
  }

  goToAdvertCreation() {
    this.router.navigate(['form']);
  }

  ngAfterViewInit(): void {
    this.advertService.getUserAdverts().subscribe((response: any) => {
      this.advertsArray = response;
      console.log(this.advertsArray)
    });
  }


  onNotifyParent() {
    console.log("Reloading user adverts...")
    this.ngAfterViewInit();
  }
}
