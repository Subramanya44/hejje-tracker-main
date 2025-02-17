import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddLandmarksComponent } from './add-landmarks/add-landmarks.component';
import { ListLandmarksComponent } from './list-landmarks/list-landmarks.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';

const landmarksManagementRoutes: Routes = [
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
        component: AddLandmarksComponent
      },
      {
        path: 'edit/:id',
        component: AddLandmarksComponent
      },
      {
        path: 'list',
        component: ListLandmarksComponent
      },
      {
        path: '',
        component: ListLandmarksComponent
      }
    ]
  
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    AddLandmarksComponent,
    ListLandmarksComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(landmarksManagementRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent

  ]
})
export class LandmarkManagementModule { }
