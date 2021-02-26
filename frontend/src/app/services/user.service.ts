import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { storageKeys as authKeys } from './auth.service';


export interface UserData{
  id: number,
  username: string,
  role: string,
  createdAt?:string,
  updatedAt?:string,
}

export interface MenuData {
  id: number,
  formId?: number,
  parentId?:number,
  name: string,
  childrens?: MenuData[]
}

export interface MenuCreate {
  formId?: number,
  parentId?:number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url: string = undefined;
  headers: HttpHeaders = undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.api_url = environment.api_url;
    this.headers = new HttpHeaders({'Content-Type': 'application/json', [authKeys.auth]: localStorage.getItem(authKeys.auth)});
  }

  getData(): Observable<UserData>{
    const request =  this.http.get<UserData>(`${this.api_url}/user`,  { headers: this.headers }).pipe(share());
    return request;
  }

  getMenu(parentId: number, limit: number) :Observable<MenuData|MenuData[]> {
    let params = "";
    if(limit && !parentId) params = `/?limit=${limit}`;
    if(parentId && !limit) params = `/?id=${parentId}`;
    if(parentId && limit) params = `/?id=${parentId}&limit=${limit}`;
    const request = this.http.get<MenuData|MenuData[]>(`${this.api_url}/menu${params}`,{  headers: this.headers }).pipe(share());
    return request;
  }

  createMenu(menu: MenuCreate){
    const request = this.http.post(`${this.api_url}/menu`, menu, {headers: this.headers, responseType: "text"}).pipe(share());
    return request;
  }

  deleteMenu(id: number){
    const request = this.http.delete(`${this.api_url}/menu?id=${id}`, {headers: this.headers, responseType: "text"}).pipe(share());
    return request;
  }

  logout(){
    localStorage.removeItem(authKeys.auth);
    window.location.reload();
  }
}
