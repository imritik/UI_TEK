import { Component, Injectable, OnInit, OnDestroy , AfterViewInit, ViewChildren, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl,FormControlName } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { Router } from '@angular/router';
import { ReceiveValueService } from './../../services/reset-password-service.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { Subscription , fromEvent, merge, pipe, throwError} from 'rxjs';

export interface BooleanService {
  status: boolean;
}

@Component({
  selector: 'app-reset-password-first-time-login',
  templateUrl: './reset-password-first-time-login.component.html',
  styleUrls: ['./reset-password-first-time-login.component.css']
})

export class ResetPasswordFirstTimeLoginComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];

  public resetPassword: FormGroup;
  public message: string;
  private _valuePass: object;
  public passwordMessage: String;
  public confirmPasswordMessage: String;
  private _email: string;
  private _token: string;
  private ValidationMessages = {
    required: 'Please enter your password.',
    requirements: 'Password needs to be at least eight characters, one uppercase letter and one number',
    mustMatch: 'Passwords must match',
    blur: 'Field is required'
  };

  constructor(public passwordCapture: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private valueReceived: ReceiveValueService) { }

  ngOnInit() {
    this.CheckFirstLogin();
    this.EnterCredentials();
  }

  public CheckFirstLogin() {
    this.ExtractValueFromURL();
    console.log(this._email,"extracted");
    var loginValue = {
      email: this._email,
      resetPasswordToken: this._token
    }
    console.log(loginValue);
    this.valueReceived.sendToken(loginValue).subscribe((data: boolean) => {
      console.log(data);
      if (data == false) {
        this.message = "Invalid user";
        console.log("invalid user ")
        this.snackBar.open(this.message, "", { duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center' });
        this.router.navigate(['/login']);
      }
    });
  }

  public ExtractValueFromURL() {
      this._email=this.route.snapshot.paramMap.get('email');
      this._token=this.route.snapshot.paramMap.get('token');      
  }

  public EnterCredentials() {
    this.resetPassword = this.passwordCapture.group({
      password: ['', [Validators.required, Validators.minLength(8), this.CheckPassword]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: this.PasswordMatch('password', 'confirmPassword')
      });
  }

  public CheckPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  public PasswordMatch(password: string, confirmPassword: string) {
    return (passwordCheck: FormGroup) => {
      const control = passwordCheck.controls[password];
      const matchingControl = passwordCheck.controls[confirmPassword];

      if (matchingControl.errors && !matchingControl.errors.passwordMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  ngAfterViewInit() {
    const passwordControl = this.resetPassword.get('password');
    const confirmPasswordControl = this.resetPassword.get('confirmPassword');

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

  public SetPasswordMessage(pass: AbstractControl): void {
    this.passwordMessage = '';
    if ((pass.touched || pass.dirty) && pass.errors) {
      this.passwordMessage = Object.keys(pass.errors).map(
        key => this.ValidationMessages[key]).join(' ');
    }
  }

  public SetConfirmPasswordMessage(conPassword: AbstractControl): void {
    this.confirmPasswordMessage = '';
    if ((conPassword.touched || conPassword.dirty) && conPassword.errors) {
      this.confirmPasswordMessage = Object.keys(conPassword.errors).map(
        key => this.ValidationMessages[key]).join(' ');
    }
  }

  public OnSubmit(resetPassword) {
    console.log(resetPassword.value);
    console.log(this._email);
    var passwordValue = {
      email: this._email,
      employeePassword: this.resetPassword.value.password
    }
    this.valueReceived.sendPassword(passwordValue).subscribe((data: boolean) => {
      console.log(data);
      if (data == true) {
        this.message = "Password successfully saved";
        this.snackBar.open(this.message, "", { duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center' });
        this.router.navigate(['/login']);
      }
      else {
        this.message = "Password could not be saved";
        this.snackBar.open(this.message, "", { duration: 5000, verticalPosition: 'bottom', horizontalPosition: 'center' });
      }
    });
  }
}