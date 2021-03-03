
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { storageKeys as authKeys } from './auth.service';


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

export interface MenuUpdate {
  formId?: number,
  parentId?:number,
  name?: string
}

export interface MenuQuery {
  id?:string,
  limit?:string
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  api_url: string = undefined;
  headers: HttpHeaders = undefined;

  constructor(private http: HttpClient) {
    this.api_url = environment.api_url;
    this.headers = new HttpHeaders({'Content-Type': 'application/json', [authKeys.auth]: localStorage.getItem(authKeys.auth)});
   }

  getMenu(target: MenuQuery) :Observable<MenuData|MenuData[]> {
    const request = this.http.get<MenuData|MenuData[]>(`${this.api_url}/menu`,{  headers: this.headers, params: { ...target } }).pipe(share());
    return request;
  }

  createMenu(menu: MenuCreate){
    const request = this.http.post(`${this.api_url}/menu`, menu, {headers: this.headers, responseType: "text"}).pipe(share());
    return request;
  }

  updateMenu(id: number, menu: MenuUpdate){
    const request = this.http.put(`${this.api_url}/menu?id=${id}`, menu, {headers: this.headers, responseType: "text"}).pipe(share());
    return request;
  }

  deleteMenu(id: number){
    const request = this.http.delete(`${this.api_url}/menu?id=${id}`, {headers: this.headers, responseType: "text"}).pipe(share());
    return request;
  }
}
