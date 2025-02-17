import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATH } from 'src/app/constants/constant';
import { TranslateService } from "@ngx-translate/core";
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [IonicModule, FormsModule,
    ReactiveFormsModule],
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

  logoPath?: string = PATH.logo ?? 'assets/svg/elephant-logo-white.svg';
  language: string = 'kn'

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    const lang = localStorage.getItem('language')
    if (lang) {
      this.translateService.use(lang);
      this.language = lang;
    } else {
      this.translateService.use('kn');
      this.language = 'kn';
    }
  }

  languageChange() {
    localStorage.setItem('language', this.language)
    this.translateService.use(this.language);
  }
}
