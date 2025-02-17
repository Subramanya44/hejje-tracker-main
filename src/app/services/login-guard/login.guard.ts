import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

   canActivate( ): boolean {
    if (this.authService.getCurrentUserId()) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;

  }
  
}
