import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(
    private router: Router,
    private loginService: LoginService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const user:any = localStorage.getItem('user_data');
      // console.log(JSON.parse(this.loginService.decryptSTR(user)));
      
      if (user != null) {
        //user can access the path
        this.router.navigate(['dashboard']);
        return false;
      } else {
        //user can't access the path
        return true;
      }

  }
  
}