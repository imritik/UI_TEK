import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChangePasswordComponent } from "./component/change-password/change-password.component";
import { LoginComponent } from "./component/login/login.component";
import { ResetPasswordFirstTimeLoginComponent } from "./component/reset-password-first-time-login/reset-password-first-time-login.component";
import { EnterEmailComponent } from './component/enter-email/enter-email.component';
import { ForgotPassConfirmPassComponent } from './component/forgot-pass-confirm-pass/forgot-pass-confirm-pass.component';
import{EducationDetailsComponent} from './feature-module/component/education-details/education-details.component';
const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "ChangePassword", component: ChangePasswordComponent },
  { path: "resetpassword/:email/:token", component: ResetPasswordFirstTimeLoginComponent },
  { path: 'enterEmail', component: EnterEmailComponent },
  { path: 'forgotPassword/:token', component: ForgotPassConfirmPassComponent },
  {path:'educationdetails',component:EducationDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
