import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatError, MatFormField, MatInput} from "@angular/material/input";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInput,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatFormField,
    MatLabel,
    MatButton,
    MatButtonToggle,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatError
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [ AuthService ]
})
export class RegisterComponent {
  public registerForm: FormGroup;
  constructor(public authService: AuthService) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

}
