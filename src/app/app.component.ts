import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core'; // add this
import { catchError, of } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { Profile, UserRole } from './models/profile';
import { MenuController } from '@ionic/angular';
import { homeData, pagesData } from './constants/constant';
import { MenuItem } from './models/menu-item';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showPages: MenuItem[] = [homeData];
  // public appPages = pagesData;

  profile_role: string = '';
  profileRole: UserRole = UserRole.NO_USER;
  protected user: User = <User>{};
  protected profile: Profile = <Profile>{};
  protected email: string | undefined = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private menu: MenuController
  ) {
  }

  ngOnInit(): void {
    // get profile role from local storage
    this.profile_role = localStorage.getItem('profile_role') || '';
    this.profileRole = UserRole[this.profile_role as keyof typeof UserRole] || UserRole.NO_USER;
    this.initializeApp();
    this.isLoggedIn();
    this.updateSidebar();
  }

  isLoggedIn() {
    this.authService
      .getCurrentUser()
      .pipe(
        catchError((error) => {

          // Handle the error here, e.g., log it or show a message to the user
          console.error('Error occurred while fetching current user:', error);
          // Returning an empty observable to continue the stream
          return of(null);
        })
      )
      .subscribe(async (data) => {
        if (data != null) {
          const role = localStorage.getItem('profile_role') || '';

          this.user = <User>data;
          this.email = this.user.email;
          await this.authService.getCurrentProfileOnLocalStorage();
          this.updateSidebar();
        } else {
          this.user = <User>{};
          this.email = '';
         
        }
      });
  }

  logout() {

    this.profile_role = '';
    this.updateSidebar();
    this.authService.signOut().then((r) => this.router.navigate(['/home']));
    this.menu.close();
  }

  login() {
    this.router.navigate(['/auth']);
    this.menu.close();
  }

  initializeApp() {
    this.translate.addLangs(['kn', 'en']);
    const lang = localStorage.getItem('language')
    if (lang != null) {
      this.translate.use(lang);
    } else {
      localStorage.setItem('language', 'kn')
      this.translate.use('kn');
    }
  }

  async updateSidebar() {
    this.showPages = this.filterPagesByRole(pagesData, this.profileRole);
  }

  filterPagesByRole(pages: MenuItem[], role: UserRole): MenuItem[] {
    return pages.filter(page => this.isMenuAllowed(page.roles))
      .map(page => ({
        ...page,
        children: this.filterPagesByRole(page.children || [], role)
      }));
  }

  isMenuAllowed(roles: UserRole[]): boolean {
    return roles.includes(this.profileRole);
  }
}
