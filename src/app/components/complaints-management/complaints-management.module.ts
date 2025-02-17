import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { AddComplaintsComponent } from './add-complaints/add-complaints.component';
import { ListElephantComponent } from '../elephant-management/list-elephant/list-elephant.component';
import { ListComplaintsComponent } from './list-complaints/list-complaints.component';

const complaintsRoute: Routes = [
  {
    path: '',
    redirectTo: 'complaints-management',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'add',
        component: AddComplaintsComponent
      },
      {
        path: 'edit/:id',
        component: AddComplaintsComponent
      },
      {
        path: 'list',
        component: ListComplaintsComponent
      },
      {
        path: '',
        component: ListComplaintsComponent
      }
    ]
  }
]


@NgModule({
  declarations: [DashboardComponent, AddComplaintsComponent, ListComplaintsComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(complaintsRoute),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComplaintsManagementModule { }
