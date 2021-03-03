import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export interface UserData{
  id: number,
  username: string,
  role: string,
  createdAt?:string,
  updatedAt?:string,
}




@Injectable({
  providedIn: 'root'
})
export class UserService {

  protected api_url: string = undefined;
  protected headers: HttpHeaders = undefined;
  protected user: UserData = undefined;

  constructor(protected http: HttpClient) {
    this.api_url = environment.api_url;
  }

  protected loadToken(token: string){
    this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
  }

  public getData(): Observable<UserData>{
    const request =  this.http.get<UserData>(`${this.api_url}/user`,  { headers: this.headers }).pipe(share());
    return request;
  }

  public getUser(): UserData{
    return this.user;
  }

  public getAll(): Observable<JSON[]>{
    const request =  this.http.get<JSON[]>(`${this.api_url}/user/all`,  { headers: this.headers }).pipe(share());
    return request;
  }

}
