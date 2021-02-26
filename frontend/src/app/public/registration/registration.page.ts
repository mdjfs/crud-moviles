import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { storageKeys as welcomeKeys } from '../welcome/welcome.page';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

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

  processRegister(user, pass){
    if(!user || !pass){
      this.error = "Please enter a username and password";
    }else{
      this.error = undefined;
      this.auth.register({username: user, password: pass})
      .subscribe(
        () => this.router.navigate(['/menu']),
        () => this.error = `User exists or Server Error.`
      )
    }
  }

}
