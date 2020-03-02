import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormControlName } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from "@angular/material";
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { LoginService } from './../../services/login/login.service';
import { Observable, fromEvent, merge } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  emailMessage: String;
  passwordMessage: String;
  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];
  displayMessage: { [key: string]: string } = {};

  private _validationMessages = {
    required: 'Please enter your email address.',
    pattern: "Please enter a valid email address"
  };
  private _validationMessages2 = {
    required: 'Please enter your password.'
  };

  constructor(private _formBuiler: FormBuilder,
    private _http: HttpClient,
    private _router: Router,
    public snackBar: MatSnackBar,
    private _loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = this._formBuiler.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]],
      employeePassword: ['', [Validators.required]]
    });

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('employeePassword');

    emailControl.valueChanges.pipe
      (
      debounceTime(1000)
      ).subscribe(
        value => this.setEmailMessage(emailControl)
      );

    passwordControl.valueChanges.pipe
      (
      debounceTime(1000)
      ).subscribe(
        value => this.setPasswordMessage(passwordControl)
      );
  }

  ngAfterViewInit() {
    let controlBlursPassword: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.loginForm.get('employeePassword').valueChanges, ...controlBlursPassword).pipe
      (
      debounceTime(1000)
      ).
      subscribe(
        value => this.setPasswordMessage(this.loginForm.get('employeePassword'))
      );
    let controlBlursEmail: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.loginForm.get('email').valueChanges, ...controlBlursEmail).pipe
      (
      debounceTime(1000)
      )
      .subscribe(
        value => this.setEmailMessage(this.loginForm.get('email'))
      );
  }

  OpenSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  submitForm() {
    var postDataModel = {

      email: this.loginForm.value.email,
      employeePassword: this.loginForm.value.employeePassword
    }
    this._loginService.loginUser(postDataModel)
      .subscribe((data: boolean) => {
        data ? this._router.navigate(['/']) : this.OpenSnackBar('Invalid Username/Password', '')
        console.log(data);
      });
  }

  setEmailMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this._validationMessages[key]).join(' ');
    }
  }

  setPasswordMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map(
        key => this._validationMessages2[key]).join(' ');
    }
  }
}



