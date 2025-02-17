import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';

const reportsManagementRoutes: Routes = [
  {
    path: 'reports-management',
    redirectTo: 'reports-management',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'reports',
        component: ManageReportsComponent
      }
    ]
  
  }
]
@NgModule({
  declarations: [ManageReportsComponent, DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(reportsManagementRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsManagementModule { }
