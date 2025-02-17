import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { PATH } from 'src/app/constants/constant';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent  implements OnInit {
  passwordForm: FormGroup;
  logoPath?: string = PATH.logo ?? 'assets/svg/elephant-logo-white.svg';

  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
   }

  ngOnInit() {
   
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }


  async changePassword() {
    const formData = this.passwordForm.value;
    // Call your authentication service to change the password
    try {
      await this.authService?.updateUser(formData.newPassword);
      this.passwordForm.reset();
      this.showAlert('Success', 'Password changed successfully.');
    } catch (error:any) {
      this.showAlert('Error', error.message);
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}