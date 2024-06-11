import {CanActivateFn, Router} from '@angular/router';
import {inject, Injectable} from "@angular/core";
import {jwtDecode} from "jwt-decode";
@Injectable({
  providedIn: "root"
})
class RedirectLoginGuard {
  constructor(public router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem("jwtToken") && !this.isJWTExpired()) {
      this.router.navigate(['/dashboard']);
      console.log("User authenticated");
      return false;
    }
    return true;
  }

  private isJWTExpired(): boolean {
    const decodedJwt = jwtDecode(localStorage.getItem("jwtToken")!).exp;
    if (decodedJwt) {
      const currentTime = new Date().getTime()/1000;
      return decodedJwt<currentTime;
    }
    return true;
  }
}
export const redirectLoginGuard: CanActivateFn = ():boolean => {
  return inject(RedirectLoginGuard).canActivate();
};
