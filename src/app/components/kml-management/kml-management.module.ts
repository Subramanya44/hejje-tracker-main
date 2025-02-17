import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddKmlComponent } from './add-kml/add-kml.component';
import { ListKmlComponent } from './list-kml/list-kml.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';

const kmlManagementRoutes: Routes = [
  {
    path: '',
    redirectTo: 'kml-management',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'add',
        component: AddKmlComponent
      },
      {
        path: 'edit/:id',
        component: AddKmlComponent
      },
      {
        path: 'list',
        component: ListKmlComponent
      },
      {
        path: '',
        component: ListKmlComponent
      }
    ]
  
  }
]

@NgModule({
  declarations: [ DashboardComponent, AddKmlComponent, ListKmlComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(kmlManagementRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class KmlManagementModule { }
