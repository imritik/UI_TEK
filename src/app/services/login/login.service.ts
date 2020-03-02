import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpWrapperService } from '../http-wrapper/http-wrapper.service'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _Url = "http://10.188.200.210:8080//login/authenticate";
  constructor(
    private _http: HttpClient,
    private _httpWrapperService: HttpWrapperService
  ) { }

  loginUser(formdata) {
    return this._httpWrapperService.PostJson(formdata, this._Url)
  }
}
