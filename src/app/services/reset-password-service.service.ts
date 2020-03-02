import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BooleanService } from './../component/reset-password-first-time-login/reset-password-first-time-login.component';
import { HttpWrapperService } from './http-wrapper/http-wrapper.service';
@Injectable({
  providedIn: 'root'
})
export class ReceiveValueService {
  public passwordURL: string = 'http://10.188.200.210:8080/login/registerpassword/update';
  public tokenURL: string = 'http://10.188.200.210:8080/login/registerpassword/validtoken ';

  constructor(private http: HttpClient,
    private httpSendData: HttpWrapperService) { }

  public sendToken(formdata) {
    return this.httpSendData.PostJson(formdata, this.tokenURL);
  }

  public sendPassword(formdata) {
    return this.httpSendData.PostJson(formdata, this.passwordURL);
  }
}
