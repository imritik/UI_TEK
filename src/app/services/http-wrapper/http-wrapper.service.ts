import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {

  constructor(private _http: HttpClient) { }

  PostJson(model: any, endPointUrl: string): Observable<any> {
    let dataToSend = JSON.stringify(model);
    console.log(dataToSend);
    return this._http.post<any>(endPointUrl, dataToSend,
      {
        headers: new HttpHeaders().
          set('Content-Type', 'application/json')
      }
    ).pipe(tap(data => {
      console.log(data),
        map(x => {
          console.log(x)
        })
    }) //catchError(this.HandleError)
    );
  }

  GetById(paraName: string, paraValue: any, endPointUrl: string): Observable<any> {
    let param = new HttpParams().set(paraName, paraValue);
    return this._http.get<any>(endPointUrl, { params: param })
      .pipe(catchError(this.HandleError));
  }


  PostToken(endPointUrl: string, dataToSend: any): Observable<any> {
    return this._http.post(
      endPointUrl,
      dataToSend,
      { responseType: 'text' })
  }

  //handle error response from http
  private HandleError(error: HttpResponse<any>, self: any): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.log(error);
    //return Observable.throw(error || 'Server error');
    return throwError(new Error(error.body));
  }

  GetData(endPointUrl: string): Observable<any> {
    return this._http.get<any>(endPointUrl)
      .pipe(catchError(this.HandleError));
  }
}
