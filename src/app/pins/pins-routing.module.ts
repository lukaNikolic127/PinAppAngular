import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PinsPage } from './pins.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PinsPage,
    children: [
      {
        path: 'explore',
        loadChildren: () => import('./explore/explore.module').then( m => m.ExplorePageModule)
      },
      {
        path: 'favorites',
        loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
      },
      {
        path: '',
        redirectTo: '/pins/tabs/explore',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pins/tabs/explore',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PinsPageRoutingModule {}
