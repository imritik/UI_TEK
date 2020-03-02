import { NgMaterialModuleModule } from "./ng-material-module/ng-material-module.module";
import { CommonModuleModule } from "./common-module/common-module.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatRippleModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatMomentDateModule 
} from "@angular/material";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./component/login/login.component";
import { ChangePasswordComponent } from "./component/change-password/change-password.component";
import { ShowHidePasswordModule } from "ngx-show-hide-password";
import { ChangePasswordService } from "./services/change-password/change-password.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ResetPasswordFirstTimeLoginComponent } from "./component/reset-password-first-time-login/reset-password-first-time-login.component";
import { EnterEmailComponent } from "./component/enter-email/enter-email.component";
import { ForgotPassConfirmPassComponent } from "./component/forgot-pass-confirm-pass/forgot-pass-confirm-pass.component";
import { EducationDetailsComponent } from './feature-module/component/education-details/education-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordFirstTimeLoginComponent,
    ChangePasswordComponent,
    EnterEmailComponent,
    ForgotPassConfirmPassComponent,
    EducationDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModuleModule,
    FormsModule,
    MatSnackBarModule,
    NgMaterialModuleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    AppRoutingModule,
    MatRippleModule,
    MatMomentDateModule 
  
  ],
  exports: [
    LoginComponent,
    NgMaterialModuleModule,
    MatToolbarModule,
    MatRippleModule,
    ShowHidePasswordModule,
    MatSnackBarModule,
    MatMomentDateModule
  ],
  providers: [ChangePasswordService,MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
