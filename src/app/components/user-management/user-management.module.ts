import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './users-list/users-list.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import { NavigationComponent } from '../navigation/navigation.component';

const managementRoutes: Routes = [
  {
    path: '',
    redirectTo: 'management',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'management',
        component: UsersListComponent
      }
    ]
  }
]


@NgModule({
  declarations: [
    DashboardComponent,
    UsersListComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(managementRoutes),
        TranslateModule,
        NavigationComponent

    ]
})
export class UserManagementModule { }
