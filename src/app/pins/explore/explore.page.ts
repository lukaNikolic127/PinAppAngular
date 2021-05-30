import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Pin} from '../pin.model';
import {PinsService} from '../pins.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit, OnDestroy {

  pins: Pin[];
  private pinSub: Subscription;

  constructor(private pinsService: PinsService) {
    // this.pins = this.pinsService.pins;
  }

  ngOnInit() {
    this.pinSub = this.pinsService.pins.subscribe((pins) => {
      this.pins = pins;
    });
  }

  ionViewWillEnter(){
    this.pinsService.getPins().subscribe((pins) => {
      // this.pins = pins;
    });
    // console.log('EXPLORE WILL ENTER');
  }

  ngOnDestroy() {
    if(this.pinSub){
      this.pinSub.unsubscribe();
    }
  }
}
