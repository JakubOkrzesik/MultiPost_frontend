import {Component, OnInit} from '@angular/core';
import {AllegroService} from "../../services/allegro.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-allegro-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './allegro-auth-callback.component.html',
  styleUrl: './allegro-auth-callback.component.scss'
})
export class AllegroAuthCallbackComponent implements OnInit {

  constructor(private allegroService: AllegroService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.allegroService.allegroAuth(code).subscribe(
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
