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
      const response = await fetch(`${this.api_url}/login`, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const text = await response.text();
      if(response.status !== 200) throw new Error(text);
      else this.token = text;
      return null;
    }catch(e){
      return e;
    }
  }

  async register(data: UserData): Promise<Error|null>{
    try{
      const response = await fetch(`${this.api_url}/user`, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const text = await response.text();
      if(response.status !== 200) throw new Error(text);
      else this.token = text;
      return null;
    }catch(e){
      return e;
    }
  }

  isLogged(): Boolean{
    return this.token === null;
  }

  getToken(): string{
    return this.token;
  }
}
