import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  HttpHeaders } from '@angular/common/http';
import { share } from 'rxjs/operators';
import { UserService } from './user.service';

export interface UserCredentials{
  username: string,
  password: string
}


export interface UserData{
  id: number,
  username: string,
  role: string,
  createdAt?:string,
  updatedAt?:string,
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

const storageKeys = {
  auth: "Authorization"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends UserService{


  public login(data: UserCredentials): Observable<string>{
    const request =  this.http.post(`${this.api_url}/login`, data, {...httpOptions, responseType: "text"}).pipe(share());
    request.subscribe((token: string) => {
      localStorage.setItem(storageKeys.auth, token);
      this.loadToken(token);
    })
    return request;
  }

  public register(data: UserCredentials): Observable<string>{
    const request =  this.http.post(`${this.api_url}/user`, data, {...httpOptions, responseType: "text"}).pipe(share());
    request.subscribe((token: string) => {
      localStorage.setItem(storageKeys.auth, token);
      this.loadToken(token);
    })
    return request;
  }

  public async isLogged(): Promise<Boolean>{
    const token = this.getToken();
    if(this.user) return true;
    if(token !== null && !this.user){
      this.loadToken(token);
      try{
        this.user = await this.getData().toPromise();
        return true;
      }catch{
        return false;
      }
    }else return false;
  }

  public getToken(): string{
    return localStorage.getItem(storageKeys.auth);
  }

  public logout(){
    localStorage.removeItem(storageKeys.auth);
    this.user = null;
    window.location.reload();
  }
}


export {storageKeys};
