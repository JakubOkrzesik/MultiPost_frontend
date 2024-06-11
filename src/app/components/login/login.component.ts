import {Component} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatError, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatLabel,
    MatInput,
    MatFormField,
    MatButton,
    MatButtonToggle,
    ReactiveFormsModule,
    NgIf,
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ AuthService ]
})
export class LoginComponent {

  public loginForm: FormGroup;

  constructor(public authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }
}
