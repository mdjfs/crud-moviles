import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {  HttpHeaders, HttpClient } from '@angular/common/http';
import { share } from 'rxjs/operators';

export interface UserData{
  username: string,
  password: string
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
export class AuthService {

  api_url: string = undefined;

  constructor(private http: HttpClient) {
    this.api_url = environment.api_url;
  }

  public login(data: UserData): Observable<string>{
    const request =  this.http.post(`${this.api_url}/login`, data, {...httpOptions, responseType: "text"}).pipe(share());
    request.subscribe((token: string) => {
      localStorage.setItem(storageKeys.auth, token);
    })
    return request;
  }

  public register(data: UserData): Observable<string>{
    const request =  this.http.post(`${this.api_url}/user`, data, {...httpOptions, responseType: "text"}).pipe(share());
    request.subscribe((token: string) => {
      localStorage.setItem(storageKeys.auth, token);
    })
    return request;
  }

  public isLogged(): Boolean{
    return this.getToken() !== null;
  }

  public getToken(): string{
    return localStorage.getItem(storageKeys.auth);
  }
}


export {storageKeys};
