import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private auth: AuthService, private router: Router) { }

  public async canActivate(): Promise<boolean>{
    const isLogged = await this.auth.isLogged();
    if(isLogged){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
