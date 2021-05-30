import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinsPageRoutingModule } from './pins-routing.module';

import { PinsPage } from './pins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinsPageRoutingModule
  ],
  declarations: [PinsPage]
})
export class PinsPageModule {}
