
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { storageKeys as authKeys } from './auth.service';


export interface ResultTarget {
  id?:number,
  formId?:number,
  userId?:number
}

export interface ResultData {
  id?:string,
  name: string,
  result: JSON,
  userId?: number,
  formId: number
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {


  api_url: string = undefined;
  headers: HttpHeaders = undefined;

  constructor(private http: HttpClient) {
    this.api_url = environment.api_url;
    this.headers = new HttpHeaders({'Content-Type': 'application/json', [authKeys.auth]: localStorage.getItem(authKeys.auth)});
   }

  getResult(target: ResultTarget): Observable<ResultData[]>{
    const request = this.http.put<ResultData[]>(`${this.api_url}/result`, target, {headers: this.headers, responseType: "json"}).pipe(share());
    return request;
  }

  createResult(data: ResultData){
    const request = this.http.post(`${this.api_url}/result`, data, {headers: this.headers, responseType: "text"}).pipe(share());
    return request;
  }
}
