import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then( m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then( m => m.AuthModule)
  },

  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
  },
  {
    path: 'track',
    loadChildren: () => import('./components/track-management/track-management.module').then( m => m.TrackManagementModule),
  },
  {
    path: 'user-management',
    loadChildren: () => import('./components/user-management/user-management.module').then( m => m.UserManagementModule),
  },
  {
    path: 'elephant-management',
    loadChildren: () => import('./components/elephant-management/elephant-management.module').then( m => m.ElephantManagementModule),
  },
  {
    path: 'kml-management',
    loadChildren: () => import('./components/kml-management/kml-management.module').then( m => m.KmlManagementModule),
  },
  {
    path: 'radio-collars',
    loadChildren: () => import('./components/radio-collars-management/radio-collars-management.module').then( m => m.RadioCollarsManagementModule),
  },
  {
    path: 'landmarks-management',
    loadChildren: () => import('./components/landmark-management/landmark-management.module').then( m => m.LandmarkManagementModule),
  },
  {
    path: 'reports-management',
    loadChildren: () => import('./components/report-management/reports-management.module').then( m => m.ReportsManagementModule),
  },
  {
    path: 'complaints-management',
    loadChildren: () => import('./components/complaints-management/complaints-management.module').then( m => m.ComplaintsManagementModule),
  },
  {
    path: 'role-management',
    loadChildren: () => import('./components/role-management/role-management.module').then( m => m.RoleManagementModule),
  },
  {
    path: 'announcement-management',
    loadChildren: () => import('./components/announcement-management/announcement-management.module').then( m => m.AnnouncementManagementModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
