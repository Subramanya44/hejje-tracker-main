import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CircleDashboardComponent } from './circle-dashboard/circle-dashboard.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { AddCircleComponent } from './add-circle/add-circle.component';
import { ListCircleComponent } from './list-circle/list-circle.component';
import { AddDivisionComponent } from './add-division/add-division.component';
import { ListDivisionComponent } from './list-division/list-division.component';
import { DivisionDashboardComponent } from './division-dashboard/division-dashboard.component';
import { AddRangeComponent } from './add-range/add-range.component';
import { ListRangeComponent } from './list-range/list-range.component';
import { RangeDashboardComponent } from './range-dashboard/range-dashboard.component';
import { AddSectionComponent } from './add-section/add-section.component';
import { ListSectionComponent } from './list-section/list-section.component';
import { SectionDashboardComponent } from './section-dashboard/section-dashboard.component';
import { AddVillageComponent } from './add-village/add-village.component';
import { ListVillageComponent } from './list-village/list-village.component';
import { VillageDashboardComponent } from './village-dashboard/village-dashboard.component';

const roleManagementRoutes: Routes = [
  {
    path: 'list-circle',
    component: CircleDashboardComponent,
    children: [
      {
        path: 'add',
        component: AddCircleComponent
      },
      {
        path: 'edit/:id',
        component: AddCircleComponent
      },
      {
        path: 'list',
        component: ListCircleComponent
      },
      {
        path: '',
        component: ListCircleComponent
      }
    ]
  
  },
  {
    path: 'list-division',
    component: DivisionDashboardComponent,
    children: [
      {
        path: 'add',
        component: AddDivisionComponent
      },
      {
        path: 'edit/:id',
        component: AddDivisionComponent
      },
      {
        path: 'list',
        component: ListDivisionComponent
      },
      {
        path: '',
        component: ListDivisionComponent
      }
    ]
  
  },
  {
    path: 'list-range',
    component: RangeDashboardComponent,
    children: [
      {
        path: 'add',
        component: AddRangeComponent
      },
      {
        path: 'edit/:id',
        component: AddRangeComponent
      },
      {
        path: 'list',
        component: ListRangeComponent
      },
      {
        path: '',
        component: ListRangeComponent
      }
    ]
  
  },
  {
    path: 'list-section',
    component: SectionDashboardComponent,
    children: [
      {
        path: 'add',
        component: AddSectionComponent
      },
      {
        path: 'edit/:id',
        component: AddSectionComponent
      },
      {
        path: 'list',
        component: ListSectionComponent
      },
      {
        path: '',
        component: ListSectionComponent
      }
    ]
  
  },
  {
    path: 'list-village',
    component: VillageDashboardComponent,
    children: [
      {
        path: 'add',
        component: AddVillageComponent
      },
      {
        path: 'edit/:id',
        component: AddVillageComponent
      },
      {
        path: 'list',
        component: ListVillageComponent
      },
      {
        path: '',
        component: ListVillageComponent
      }
    ]
  
  },
  {
    path: '',
    redirectTo: 'list-circle',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    CircleDashboardComponent,
    AddCircleComponent,
    ListCircleComponent,
    DivisionDashboardComponent,
    AddDivisionComponent,
    ListDivisionComponent,
    AddRangeComponent,
    ListRangeComponent,
    RangeDashboardComponent,
    AddSectionComponent,
    ListSectionComponent,
    SectionDashboardComponent,
    AddVillageComponent,
    ListVillageComponent,
    VillageDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(roleManagementRoutes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NavigationComponent

  ]
})
export class RoleManagementModule { }
