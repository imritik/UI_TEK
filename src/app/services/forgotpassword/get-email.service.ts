import { HttpWrapperService } from '../http-wrapper/http-wrapper.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetEmailService {
  constructor(
    private httpWrapperService: HttpWrapperService) { }
}
