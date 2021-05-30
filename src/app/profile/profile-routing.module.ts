import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: ProfilePage,
    children: [
      {
        path: 'my-pins',
        loadChildren: () => import('./my-pins/my-pins.module').then( m => m.MyPinsPageModule)
    },
      {
        path: '',
        redirectTo: '/profile/tabs/my-pins',
        pathMatch: 'full'
      }]
  },
  {
    path: '',
    redirectTo: '/profile/tabs/my-pins',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
