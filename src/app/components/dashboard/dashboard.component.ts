import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {Router} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatFabButton,
    MatIcon,
    NgIf,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatButton,
    MatLabel,
    MatTooltip,
    MatCardFooter
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  name!: string;
  isOlxAuth!: boolean;
  isAllegroAuth!: boolean
  olxUrl: string = 'https://www.olx.pl/oauth/authorize/?client_id=202118&response_type=code&state=x93ld3v&scope=read+write+v2'
  allegroUrl: string = `https://allegro.pl.allegrosandbox.pl/auth/oauth/authorize?response_type=code&client_id=917dfa08cadf465eb0ffc3d3b3a52c14&redirect_uri=${this.configService.ip}:4200/allegro-auth-callback`

    constructor(public authService: AuthService, private router: Router, private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.authService.getUserDetails().subscribe(response => {
      const userData = response.data;
      console.log(userData)
      this.name = userData.name
      this.isOlxAuth = userData.isOlxAuth
      this.isAllegroAuth = userData.isAllegroAuth
      localStorage.setItem("olxAuth", String(this.isOlxAuth));
      localStorage.setItem("allegroAuth", String(this.isAllegroAuth));
    })
  }

  goToUserAdverts() {
    this.router.navigate(['user-adverts'])
  }

}
