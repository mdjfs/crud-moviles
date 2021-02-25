import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface UserData{
  username: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api_url: string = undefined;
  token: string = undefined;

  constructor() {
    this.api_url = environment.api_url;
  }

  async login(data: UserData): Promise<Boolean>{
    try{
      const response =  await fetch(`${this.api_url}/login`, {
        method: "POST",
        body: JSON.stringify(data)
      });
      this.token = await response.text();
      return true;
    }catch{
      return false;
    }
  }

  async register(data: UserData): Promise<Boolean>{
    try{
      const response = await fetch(`${this.api_url}/user`, {
        method: "POST",
        body: JSON.stringify(data)
      });
      this.token = await response.text();
      return true;
    }catch{
      return false;
    }
  }

  isLogged(): Boolean{
    return this.token === null;
  }

  getToken(): string{
    return this.token;
  }
}
