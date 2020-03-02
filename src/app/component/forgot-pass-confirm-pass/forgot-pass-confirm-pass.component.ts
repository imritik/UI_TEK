import { Component, Injectable, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, FormControlName } from '@angular/forms';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { JsonPipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { HttpWrapperService } from '../../services/http-wrapper/http-wrapper.service';
import { throwError } from 'rxjs';
import { filter, map, catchError, tap } from 'rxjs/operators';
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'app-forgot-pass-confirm-pass',
  templateUrl: './forgot-pass-confirm-pass.component.html',
  styleUrls: ['./forgot-pass-confirm-pass.component.css']
})

export class ForgotPassConfirmPassComponent implements OnInit {
  formGroup: FormGroup;
  postedData: any = '';
  public persondata: any = [];
  private updateDataSub: Subscription;
  user: FormGroup;
  passwordMessage: String;
  confirmPasswordMessage: String;
  email: String
  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];

  private validationMessages = {
    required: 'Please enter your password.',
    requirements: 'Password needs to be at least eight characters, one uppercase letter and one number',
    mustMatch: 'Passwords must match',
    blur: 'Field is required'
  };

  constructor(private formBuilder: FormBuilder,
    private httpWrapperService: HttpWrapperService,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public resetPassword: FormGroup;
  private _valuePass: object;
  private jsonData = [];
  public key: object;
  public token: String;
  public userEmail: String;
  private sendPasswordUrl = 'http://10.188.200.210:8080/login/forgotpassword/update';
  private getEmail = 'http://10.188.200.210:8080/login/forgotpassword/sendemail';
  private _url = 'https://jsonplaceholder.typicode.com/posts';

  ngOnInit() {
    this.createForm();
    const passwordControl = this.formGroup.get('password');
    const confirmPasswordControl = this.formGroup.get('confirmPassword');
    // fetch token from URL 
    this.token = this.route.snapshot.paramMap.get('token');
    console.log("Got token from link " + this.token);
    // Post this token to Login Service to get the corresponding email
    this.httpWrapperService.PostToken(this.getEmail, { "resetPasswordToken": this.token })
      .subscribe(
        (response) => {
          console.log("token send ", this.token);
          console.log(response)
          this.userEmail = response;
        },
        (error) => {
          console.log(error);
        });

    passwordControl.valueChanges.pipe
      (
      debounceTime(1000)
      ).subscribe(
        value => this.SetPasswordMessage(passwordControl)
      );

    confirmPasswordControl.valueChanges.pipe
      (
      debounceTime(1000)
      ).subscribe(
        value => this.SetConfirmPasswordMessage(confirmPasswordControl)
      );
  }

  ngAfterViewInit() {
    let controlBlursPassword: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.formGroup.get('password').valueChanges, ...controlBlursPassword).pipe
      (
      debounceTime(1000)
      ).
      subscribe(
        value => this.SetPasswordMessage(this.formGroup.get('password'))
      );
    let controlBlursEmail: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.formGroup.get('confirmPassword').valueChanges, ...controlBlursEmail).pipe
      (
      debounceTime(1000)
      )
      .subscribe(
        value => this.SetConfirmPasswordMessage(this.formGroup.get('confirmPassword'))
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  SetPasswordMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  SetConfirmPasswordMessage(c: AbstractControl): void {
    this.confirmPasswordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.confirmPasswordMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  createForm(): void {
    this.formGroup = this.formBuilder.group({
      'email': [null],
      'password': [null, [Validators.required, this.checkPassword]],
      'confirmPassword': [null, [Validators.required]],
    }, {
        validator: this.MustMatch('password', 'confirmPassword')
      });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  checkPassword(control) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.formGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  NavigateToLogin() {
    this.openSnackBar('Password Successfully Changed', '');
    setTimeout(() => {
      this.router.navigate(['/login'])
    }, 2000);
  }

  public onSubmit(post, passwordValue: FormData): void {

    this.httpWrapperService.PostJson({ "employeePassword": this.formGroup.value.password, "email": this.userEmail }, this.sendPasswordUrl).subscribe(
      (response) => {
        console.log(response)
        response ? this.NavigateToLogin() : this.openSnackBar('Reset password failed', '')
      },
      (error) => {
        console.log(error)
      });
    console.log(this.formGroup.value.password);
    this.postedData = post;
    console.log(this.postedData);
  }
}

export interface PostData {
  newPassword: string;
  token: string;
}

