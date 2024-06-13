import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {IsLoginGuard} from "./guards/login.guard";
import {AdvertsFormComponent} from "./components/adverts-form/adverts-form.component";
import {StartScreenComponent} from "./components/start-screen/start-screen.component";
import {OlxAuthCallbackComponent} from "./components/olx-auth-callback/olx-auth-callback.component";
import {AllegroAuthCallbackComponent} from "./components/allegro-auth-callback/allegro-auth-callback.component";
import {UserAdvertsListComponent} from "./components/user-adverts-list/user-adverts-list.component";
import {redirectLoginGuard} from "./guards/redirect-login.guard";
import {AllegroFormsComponent} from "./components/allegro-forms/allegro-forms.component";

export const routes: Routes = [
  {path: '', component: StartScreenComponent, canActivate: [redirectLoginGuard]},
  {path: 'login', component: LoginComponent, canActivate: [redirectLoginGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [redirectLoginGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [IsLoginGuard]},
  {path: 'form', component: AdvertsFormComponent, canActivate: [IsLoginGuard]},
  {path: 'olx-auth-callback', component: OlxAuthCallbackComponent, canActivate: [IsLoginGuard]},
  {path: 'allegro-auth-callback', component: AllegroAuthCallbackComponent, canActivate: [IsLoginGuard]},
  {path: 'userAdverts', component: UserAdvertsListComponent, canActivate: [IsLoginGuard]},
  {path: 'allegroTest', component: AllegroFormsComponent, canActivate: [IsLoginGuard]}
];
