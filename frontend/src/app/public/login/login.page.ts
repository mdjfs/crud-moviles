import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {storageKeys as welcomeKeys} from '../welcome/welcome.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: boolean = undefined;
  error: string = undefined;
  hadWelcome: boolean = true;

  constructor(private router: Router, private auth: AuthService) {
    this.hadWelcome = this.hasWelcome();
   }

  ngOnInit() {

  }

  hasWelcome(){
    return localStorage.getItem(welcomeKeys.welcome) !== null;
  }

  seeWelcome(){
    localStorage.removeItem(welcomeKeys.welcome);
    this.router.navigate(['/welcome']);
  }

  processLogin(user, pass){
    if(!user || !pass){
      this.error = "Please enter a username and password";
    }else{
      this.error = undefined;
      this.auth.login({username: user, password: pass})
      .subscribe(
        () => this.router.navigate(['/menu']),
        () => this.error = `Invalid username, password or Server Error.`
      )
    }
  }
}
