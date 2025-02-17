import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {TranslateModule} from "@ngx-translate/core";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginGuard } from 'src/app/services/login-guard/login.guard';

const authRoutes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'forgot',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ChangePasswordComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(authRoutes),
    TranslateModule
  ]
})
export class AuthModule { }
