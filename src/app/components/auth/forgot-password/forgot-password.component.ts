import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { PATH } from 'src/app/constants/constant';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent  implements OnInit {

  forgotPasswordForm: FormGroup;
  logoPath? : string = PATH.logo ?? 'assets/svg/elephant-logo-white.svg';


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private loadingController: LoadingController,
              private alertController: AlertController,) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

    });
  }

  ngOnInit() {
  }


  get email() {
    return this.forgotPasswordForm.value.email
  }

  async forgotPassword() {
    const loading = await this.loadingController.create()
    await loading.present()

     this.authService.sendPwReset(this.forgotPasswordForm.value.email);
    await loading.dismiss();
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


