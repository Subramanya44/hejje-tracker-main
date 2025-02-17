import {CUSTOM_ELEMENTS_SCHEMA, NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TrackListScreenComponent} from './track-list-screen/track-list-screen.component';
import {AddTrackComponent} from './add-track/add-track.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavigationComponent} from '../navigation/navigation.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyTrackListScreenComponent} from "./mytrack-list-screen/mytrack-list-screen.component";
import {TranslateModule} from "@ngx-translate/core";
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { MapViewComponent } from './map-view/map-view.component';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import { LandmarkManagementModule } from '../landmark-management/landmark-management.module';


const trackRoutes: Routes = [
  {
    path: "",
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'my-tracks',
        component: MyTrackListScreenComponent
      },
      {
        path: 'all-tracks',
        component: TrackListScreenComponent
      },
      {
        path: 'track-data/new',
        component: AddTrackComponent
      },
      {
        path: 'track-data/:id',
        component: AddTrackComponent
      }
    ]
  },

 
]


@NgModule({
  declarations: [
    DashboardComponent,
    TrackListScreenComponent,
    AddTrackComponent,
    MyTrackListScreenComponent,
    ImageSliderComponent,
    MapViewComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        NgxLeafletLocateModule,
        RouterModule.forChild(trackRoutes),
        TranslateModule,
        NavigationComponent,
        LandmarkManagementModule
    ],
    schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrackManagementModule {
}
