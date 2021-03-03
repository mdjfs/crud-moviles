import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

const storageKeys = {
  welcome: "hadWelcome"
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage{

  constructor(private router: Router, private auth: AuthService, private authService: AuthService){}

  async ngOnInit(){
    const isLogged = await this.auth.isLogged();
    if(!isLogged){
      if(localStorage.getItem(storageKeys.welcome)){
        this.router.navigate(['/login']);
      }else{
        localStorage.setItem(storageKeys.welcome, "true");
      }
    }else{
      const user = this.authService.getUser();
      if(user.role == "admin") this.router.navigate(['/dashboard']);
      else this.router.navigate(['/menu']);
    }
  }
}


export {storageKeys};
