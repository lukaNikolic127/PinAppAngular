import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPinsPage } from './my-pins.page';

const routes: Routes = [
  {
    path: '',
    component: MyPinsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPinsPageRoutingModule {}
