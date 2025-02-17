import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { LoadingController, AlertController } from '@ionic/angular'
import { PATH } from 'src/app/constants/constant';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  logoPath?: string = PATH.logo ?? 'assets/svg/elephant-logo-white.svg';

  hidePassword: boolean = true;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private alertController: AlertController,) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {

  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  get email() {
    return this.loginForm.value.email
  }

  get password() {
    return this.loginForm.value.password
  }

  async login() {
    const loading = await this.loadingController.create()
    await loading.present()

    this.authService.signIn(this.loginForm.getRawValue()).then(async (data) => {
      await loading.dismiss();
      if (data.error) {
        await this.showAlert('Login failed', data.error.message);
      } else {
        await this.router.navigate(['/home/map']);
      }
    })
  }

  async forgotPassword() {
    const loading = await this.loadingController.create()
    await loading.present()
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }


}


