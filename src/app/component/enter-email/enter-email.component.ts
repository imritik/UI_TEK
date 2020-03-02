import { ForgotpasswordserviceService } from './../../services/forgotpassword/forgotpasswordservice.service';
import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators, AbstractControl, FormControlName } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpWrapperService } from '../../services/http-wrapper/http-wrapper.service';
import { JsonPipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Observable, fromEvent, merge } from 'rxjs';
import { PostEmailService } from 'src/app/services/forgotpassword/post-email.service';
@Component({
  selector: 'app-enter-email',
  templateUrl: './enter-email.component.html',
  styleUrls: ['./enter-email.component.css']
})

export class EnterEmailComponent implements OnInit {
  passwordMessage: String;
  confirmPasswordMessage: String;
  oldPasswordMessage: String;
  reactiveform: FormGroup;
  Email: string = "";
  response: string;
  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];

  private validationMessages = {
    required: 'Please enter your email.',
    format: "Wrong Email format",
    email: 'Email is invalid'
  };

  constructor(private frmbuilder: FormBuilder, private http: HttpClient,
    private httpWrapperService: HttpWrapperService,
    private myservice: ForgotpasswordserviceService,

    public snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  // private getTokenUrl = 'http://10.188.200.210:8080/login/forgotpassword/generatetoken';
  private getTokenUrl = 'http://10.188.200.210:8080/login/forgotpassword/generatetoken';
  ngOnInit() {
    this.reactiveform = this.frmbuilder.group({
      Email: ['', [Validators.required, Validators.email]],
    });
    const oldPasswordControl = this.reactiveform.get('Email');
    oldPasswordControl.valueChanges.pipe
      (
      debounceTime(1000)
      ).subscribe(
        value => this.SetMessage(oldPasswordControl)
      );
  }

  SetMessage(c: AbstractControl): void {
    this.oldPasswordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.oldPasswordMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  OpenSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngAfterViewInit() {
    let controlBlursPassword: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.reactiveform.get('Email').valueChanges, ...controlBlursPassword).pipe
      (
      debounceTime(1000)
      ).
      subscribe(
        value => this.SetMessage(this.reactiveform.get('Email'))
      );
  }

  PostData(reactiveform: any) {
    this.Email = reactiveform.controls.Email.value;
    console.log(this.Email);
    this.httpWrapperService.PostJson({ "email": this.Email }, this.getTokenUrl).subscribe(
      (response) => {
        console.log(response)
        this.response == response;
        return this.myservice.sendemail(response, this.Email).subscribe((data: boolean) => {
          //   console.log(data);
          data ? this.OpenSnackBar('Email sent', '') : this.OpenSnackBar('Reset Password failed', '')
          //
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }
}

