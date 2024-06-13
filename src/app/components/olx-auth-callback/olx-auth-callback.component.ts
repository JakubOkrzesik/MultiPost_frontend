import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {OlxService} from "../../services/olx.service";

@Component({
  selector: 'app-olx-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './olx-auth-callback.component.html',
  styleUrl: './olx-auth-callback.component.scss'
})
export class OlxAuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private olxService: OlxService) {}
  // needs altering no error handling
  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const code = params['code'];
    if (code) {
      this.olxService.olxAuth(code).subscribe(
        response => {
          // Handle successful response
          console.log(response);
          // Redirect to a success page or home page
          this.router.navigate(['/dashboard']);
        }
      );
    }
  });
}


}
