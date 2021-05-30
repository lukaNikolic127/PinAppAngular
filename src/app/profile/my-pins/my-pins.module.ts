import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPinsPageRoutingModule } from './my-pins-routing.module';

import { MyPinsPage } from './my-pins.page';
import {PinModalComponent} from './pin-modal/pin-modal.component';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPinsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MyPinsPage, PinModalComponent],
  entryComponents: [PinModalComponent]
})
export class MyPinsPageModule {}
