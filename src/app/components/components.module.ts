import { NgModule } from '@angular/core';
import { PinElementComponent } from './pin-element/pin-element.component';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [PinElementComponent],
    imports: [
        IonicModule,
        CommonModule
    ],
  exports: [PinElementComponent]
})

export class ComponentsModule{}

