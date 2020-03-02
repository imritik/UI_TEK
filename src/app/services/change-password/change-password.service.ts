import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpWrapperService } from '../http-wrapper/http-wrapper.service';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private _apiUrl = "http://10.188.200.210:8080/login/resetpassword/update";
  private _tokenUrl = "http://10.188.200.210:8080/login/resetpassword/generatetoken";
  private _checkPasswordUrl = 'http://10.188.200.210:8080/login/resetpassword/validuser'
  private _authTokenUrl = 'http://10.188.200.210:8080/login/resetpassword/validatetoken'
  private _token = ''
  constructor(
    private _http: HttpClient,
    private _httpWrapperService: HttpWrapperService
  ) { }

  GetToken(postDataModel) {
    return this._httpWrapperService.PostJson(postDataModel, this._tokenUrl)
  }

  AuthenticateOldPassword(postDataModel) {
    return this._httpWrapperService.PostJson(postDataModel, this._checkPasswordUrl)
  }

  AuthenticateToken(postDataModel) {
    return this._httpWrapperService.PostJson(postDataModel, this._authTokenUrl)
  }

  UpdateNewPassword(formdata) {
    return this._httpWrapperService.PostJson(formdata, this._apiUrl);
  }
}
