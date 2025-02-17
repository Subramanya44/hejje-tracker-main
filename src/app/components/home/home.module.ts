import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { RouterModule, Routes } from '@angular/router';
import { MapScreenComponent } from './map-screen/map-screen.component';
import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from 'src/app/folder/folder-routing.module';
import { NavigationComponent } from '../navigation/navigation.component';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AddComplaintsComponent } from '../complaints-management/add-complaints/add-complaints.component';
import { authGuard } from '../../services/auth.guard';

const homeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'complaints',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeScreenComponent,
    children: [
      {
        path: 'complaints',
        component: AddComplaintsComponent,
      }
    ],
  },
  {
    path: '',
    component: HomeScreenComponent,
    children: [
      {
        path: 'map',
        component: MapScreenComponent,
        canActivate: [authGuard]
      }
    ]
    
  }
  

]

@NgModule({
  declarations: [
    HomeScreenComponent,
    MapScreenComponent,
    
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgxLeafletLocateModule,
    RouterModule.forChild(homeRoutes),
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NavigationComponent

  ]
})
export class HomeModule { }
