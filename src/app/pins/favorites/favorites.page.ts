import {Component, OnDestroy, OnInit} from '@angular/core';
import {Pin} from '../pin.model';
import {PinsService} from "../pins.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {

  pins: Pin[];
  private pinSub: Subscription;
  private userSub: Subscription;
  private UID: string;

  constructor(private pinsService: PinsService, private authService: AuthService) {
    //this.pins = this.favoritesService.pins;
  }

  ngOnInit() {
    this.userSub = this.authService.userId.subscribe(id => this.UID = id);
    this.pinSub = this.pinsService.pins.subscribe((pins) => {
      this.pins = pins.filter(p => p.savedBy.includes(this.UID));
      // console.log(this.pins);
    });
  }

  ionViewWillEnter() {
    this.pinsService.getPins().subscribe((pins) => {
      this.pins = pins.filter(p => p.savedBy.includes(this.UID));
    });
    // console.log('FAVORITES WILL ENTER');
  }

  ngOnDestroy() {
    if(this.pinSub){
      this.pinSub.unsubscribe();
    }
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
