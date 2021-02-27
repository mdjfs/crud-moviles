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

  constructor(private router: Router, private auth: AuthService, private userService: UserService){}

  ngOnInit(){
    if(!this.auth.isLogged()){
      if(localStorage.getItem(storageKeys.welcome)){
        this.router.navigate(['/login']);
      }else{
        localStorage.setItem(storageKeys.welcome, "true");
      }
    }else{
      this.userService.getData()
      .subscribe((user) => {
        if(user.role == "admin") this.router.navigate(['/dashboard']);
      })
      this.router.navigate(['/menu']);
    }
  }
}


export {storageKeys};
