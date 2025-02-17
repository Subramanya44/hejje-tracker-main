import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddCollarsComponent } from './add-collars/add-collars.component';
import { ListCollarsComponent } from './list-collars/list-collars.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';

const radioCollarsManagementRoutes: Routes = [
  {
    path: '',
    redirectTo: 'collars-management',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'add',
        component: AddCollarsComponent
      },
      {
        path: 'edit/:id',
        component: AddCollarsComponent
      },
      {
        path: 'list',
        component: ListCollarsComponent
      },
      {
        path: '',
        component: ListCollarsComponent
      }
    ]
  
  }
]
@NgModule({
  declarations: [AddCollarsComponent, ListCollarsComponent, DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(radioCollarsManagementRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioCollarsManagementModule { }
