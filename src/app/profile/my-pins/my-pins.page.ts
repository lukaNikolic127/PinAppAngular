import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {PinModalComponent} from "./pin-modal/pin-modal.component";
import {PinsService} from "../../pins/pins.service";
import {Pin} from "../../pins/pin.model";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-my-pins',
  templateUrl: './my-pins.page.html',
  styleUrls: ['./my-pins.page.scss'],
})
export class MyPinsPage implements OnInit, OnDestroy {

  pins: Pin[];
  private pinSub: Subscription;
  private userSub: Subscription;
  private UID: string;

  constructor(private modalCtrl: ModalController, private pinsService: PinsService, private authService: AuthService) {
    // this.pins = this.pinsService.pins;
  }

  ngOnInit() {
    this.userSub = this.authService.userId.subscribe(id => this.UID = id);
    this.pinSub = this.pinsService.pins.subscribe((pins) => {
      this.pins = pins.filter(p => p.userId == this.UID);
    });
  }

  ionViewWillEnter(){
    this.pinsService.getPins().subscribe((pins) => {
      this.pins = pins.filter(p => p.userId == this.UID);
    });
    // console.log("Will Enter");
  }

  ngOnDestroy() {
    if(this.pinSub){
      this.pinSub.unsubscribe();
    }
  }

  openModal() {
    this.modalCtrl.create({
      component: PinModalComponent,
      componentProps: {title: 'Upload pin'}
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if(resultData.role === 'confirm') {
        // console.log(resultData);
        this.pinsService.addPin(
          resultData.data.pinData.author,
          resultData.data.pinData.description,
          resultData.data.pinData.url,
          resultData.data.pinData.savedBy,
          resultData.data.pinData.likedBy
        )
          .subscribe((pins) => {
          // this.pins = pins;
        });
      }
    });
  }
}
