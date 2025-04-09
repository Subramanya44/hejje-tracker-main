import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { ListAnnouncementComponent } from './list-announcement/list-announcement.component';
import { AnnouncementDashboardComponent } from './announcement-dashboard/announcement-dashboard.component';

const announcementManagementRoutes: Routes = [
  {
    path: 'list-announcement',
    component: AnnouncementDashboardComponent,
    children: [
      {
        path: 'add',
        component: AddAnnouncementComponent
      },
      {
        path: 'edit/:id',
        component: AddAnnouncementComponent
      },
      {
        path: 'list',
        component: ListAnnouncementComponent
      },
      {
        path: '',
        component: ListAnnouncementComponent
      }
    ]
  
  },
  {
    path: '',
    redirectTo: 'list-announcement',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AnnouncementDashboardComponent,
    AddAnnouncementComponent,
    ListAnnouncementComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  imports: [
    CommonModule,
    RouterModule.forChild(announcementManagementRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent

  ]
})

export class AnnouncementManagementModule { }
