import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {AllegroService} from "../../services/allegro.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, of, switchMap, tap} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ErrorMsgService} from "../../services/error-msg.service";

@Component({
  selector: 'app-allegro-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './allegro-auth-callback.component.html',
  styleUrl: './allegro-auth-callback.component.scss'
})
export class AllegroAuthCallbackComponent implements AfterContentInit {

  constructor(private allegroService: AllegroService, private route: ActivatedRoute, private router: Router, private errorService: ErrorMsgService) {
  }

  ngAfterContentInit(): void {
    this.route.queryParams.pipe(filter(params => params['code']!=null && params['code']!=undefined),
      switchMap(params => this.allegroService.allegroAuth(params['code']).pipe(tap(response => {
        console.log(response);
        this.router.navigate(['/dashboard']);
      }))),
      catchError(err => {
        console.log(err)
        this.errorService.displayErrorMessage(err);
        return of(null);
      })).subscribe();
  }
}
