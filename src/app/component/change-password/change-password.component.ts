import { Component, Injectable, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, FormControlName } from '@angular/forms';
import { Observable, Subscription, fromEvent, merge, pipe, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from "@angular/material";
import { ChangePasswordService } from './../../services/change-password/change-password.service';
import { Router } from "@angular/router";
import { JsonPipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];

  formGroup: FormGroup;
  postedData: any = '';
  oldPasswordMessage: String;
  passwordMessage: String;
  confirmPasswordMessage: String;
  displayMessage: string;
  private _token = '';
  public persondata: any = [];
  public loading: boolean;
  private _updateDataSub: Subscription;
  private _getTokenSub: Subscription;
  private _oldPasswordSub: Subscription;
  private _resetPasswordSub: Subscription;
  private _isValidToken: boolean

  private validationMessages = {
    required: 'Please enter your password.',
    requirements: 'Password needs to be at least eight characters, one uppercase letter and one number',
    mustMatch: 'Passwords must match',
    blur: 'Field is required'
  };

  constructor(private _formBuilder: FormBuilder,
    private _http: HttpClient,
    public snackBar: MatSnackBar,
    private _changePasswordservice: ChangePasswordService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.GetSessionToken();
    const oldPasswordControl = this.formGroup.get('oldPassword');
    const passwordControl = this.formGroup.get('password');
    const confirmPasswordControl = this.formGroup.get('confirmPassword');

    oldPasswordControl.valueChanges.pipe
      (
      debounceTime(1000)
      ).subscribe(
        value => this.SetMessage(oldPasswordControl)
      );

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
    const oldPasswordControl = this.formGroup.get('oldPassword');
    const passwordControl = this.formGroup.get('password');
    const confirmPasswordControl = this.formGroup.get('confirmPassword');

    let controlBlursOldPassword: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(oldPasswordControl.valueChanges, ...controlBlursOldPassword)
      .pipe
      (
      debounceTime(1000)
      )
      .subscribe(
        value => this.SetMessage(oldPasswordControl)
      );

    let controlBlurs: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(passwordControl.valueChanges, ...controlBlurs)
      .pipe
      (
      debounceTime(1000)
      )
      .subscribe(
        value => this.SetPasswordMessage(passwordControl)
      );

    let controlBlursConfirmPassword: Observable<any>[] = this.formControls
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(confirmPasswordControl.valueChanges, ...controlBlursConfirmPassword)
      .pipe
      (
      debounceTime(1000)
      )
      .subscribe(
        value => this.SetConfirmPasswordMessage(confirmPasswordControl)
      );
  }

  SetMessage(c: AbstractControl): void {
    this.oldPasswordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.oldPasswordMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
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

  CreateForm() {
    this.formGroup = this._formBuilder.group({
      'oldPassword': [null, [Validators.required]],
      'password': [null, [Validators.required, this.CheckPassword]],
      'confirmPassword': [null, [Validators.required]],
    }, {
        validator: this.MustMatch('password', 'confirmPassword'),
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

  GetSessionToken() {
    var postDataModel = {
      "email": "kritikaplus98@gmail.com"
    }
    this._getTokenSub = this._changePasswordservice.GetToken(postDataModel)
      .subscribe((data: string) => {
        console.log(data);
        this._token = data;
        console.log(this._token);
      },
        (error) => {
          console.log(error);
          this.OpenSnackBar('Server error', '')
        });
  }

  OpenSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  CheckPassword(control) {
    let enteredPassword = control.value
    //password policy
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  CheckOldPassword() {
    var postDataModel = {
      "email": "kritikaplus98@gmail.com",
      "employeePassword": this.formGroup.value.oldPassword
    }
    this._oldPasswordSub = this._changePasswordservice.AuthenticateOldPassword(postDataModel)
      .subscribe((data: boolean) => {
        console.log(data, "valid user");
        if (data) {
          this.ValidateToken();
        }
        else {
          this.OpenSnackBar('Invalid old Password', '')
        }
      },
        (error) => {
          console.log(error);
          this.OpenSnackBar('Unable to update password', '')
        });
  }

  ValidateToken() {
    var postDataModel = {
      "email": "kritikaplus98@gmail.com",
      "resetPasswordToken": this._token
    }
    this._resetPasswordSub = this._changePasswordservice.AuthenticateToken(postDataModel)
      .subscribe((data: boolean) => {
        console.log(data, "valid token");
        if (data) {
          this.UpdatePassword();
        }
        else {
          this.OpenSnackBar('Invalid session', '')
        }
      },
        (error) => {
          console.log(error);
          this.OpenSnackBar('Unable to update password', '')
        });
  }

  NavigateToLogin() {
    this.OpenSnackBar('Password Successfully Changed', '');
    setTimeout(() => {
      this._router.navigate(['/login'])
    }, 2000);
  }

  UpdatePassword() {
    var postDataModel = {
      "email": "kritikaplus98@gmail.com",
      "employeePassword": this.formGroup.value.password
    }
    this._updateDataSub = this._changePasswordservice.UpdateNewPassword(postDataModel)
      .subscribe(
        (data: boolean) => {
          console.log(data);
          this.loading = false;
          data ? this.NavigateToLogin() : this.OpenSnackBar('Update password failed', '')
        },
        (error) => {
          console.log(error);
          this.loading = false;
          this.OpenSnackBar('Unable to update password', '')
          this.loading = false;
        });
  }

  OnSubmit(post) {
    this.postedData = post;
    this.loading = true;
    console.log(this.postedData);
    this.CheckOldPassword();
  }

  ngOnDestroy() {
    this._updateDataSub.unsubscribe();
    this._getTokenSub.unsubscribe();
    this._oldPasswordSub.unsubscribe();
    this._resetPasswordSub.unsubscribe();
  }
}
