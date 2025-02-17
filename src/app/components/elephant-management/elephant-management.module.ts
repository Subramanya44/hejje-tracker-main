import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { AddElephantComponent } from './add-elephant/add-elephant.component';
import { ListElephantComponent } from './list-elephant/list-elephant.component';

const elephantsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'elephant-management',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'add',
        component: AddElephantComponent
      },
      {
        path: 'edit/:id',
        component: AddElephantComponent
      },
      {
        path: 'list',
        component: ListElephantComponent
      },
      {
        path: '',
        component: ListElephantComponent
      }
    ]
  }
]


@NgModule({
  declarations: [DashboardComponent, AddElephantComponent, ListElephantComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(elephantsRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ElephantManagementModule { }
