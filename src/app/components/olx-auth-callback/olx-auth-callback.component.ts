import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlxService} from "../../services/olx.service";
import {catchError, filter, of, switchMap, tap} from "rxjs";
import {ErrorMsgService} from "../../services/error-msg.service";

@Component({
  selector: 'app-olx-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './olx-auth-callback.component.html',
  styleUrl: './olx-auth-callback.component.scss'
})
export class OlxAuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private olxService: OlxService, private errorService: ErrorMsgService) {}
  // needs altering no error handling
  ngOnInit(): void {
  this.route.queryParams.pipe(filter(params => params['code']!=null && params['code']!=undefined),
    switchMap(params => this.olxService.olxAuth(params['code']).pipe(tap(response => {
      console.log(response);
      this.router.navigate(['/dashboard']);
    }))),
    catchError(err => {
      console.log(err);
      this.errorService.displayErrorMessage(err);
      return of(null);
    })).subscribe();
}
}
