
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { storageKeys as authKeys } from './auth.service';

export interface FormData{
  id?:number,
  name: string,
  description: string,
  sections: SectionData[],
  createdAt?: string,
  updatedAt?:string,
  menuId: number
}

export interface SectionData{
  id?:number,
  name: string,
  fieldsId?: number[],
  fields?: FieldData[]
}

export interface FieldData{
  id?:number,
  question: string,
  type: string,
  options?: string[]
}

export interface FormQuery{
  id?:string,
  menuId?:string
}

@Injectable({
  providedIn: 'root'
})
export class FormService {


  api_url: string = undefined;
  headers: HttpHeaders = undefined;

  constructor(private http: HttpClient) {
    this.api_url = environment.api_url;
    this.headers = new HttpHeaders({'Content-Type': 'application/json', [authKeys.auth]: localStorage.getItem(authKeys.auth)});
   }

  getForm(id: number) :Observable<FormData> {
    const request = this.http.put<FormData>(`${this.api_url}/form`,{id: id}, {  headers: this.headers }).pipe(share());
    return request;
  }

  getAllForms() :Observable<FormData[]> {
    const request = this.http.get<FormData[]>(`${this.api_url}/form`, {  headers: this.headers }).pipe(share());
    return request;
  }

  createForm(form: FormData){
    const request = this.http.post<{id: number}>(`${this.api_url}/form`, form, {headers: this.headers, responseType: "json"}).pipe(share());
    return request;
  }

  deleteForm(target: FormQuery){
    const request = this.http.delete(`${this.api_url}/form`, {headers: this.headers, params: { ...target } }).pipe(share());
    return request;
  }
}
