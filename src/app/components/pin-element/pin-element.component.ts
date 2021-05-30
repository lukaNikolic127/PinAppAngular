import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Pin} from '../../pins/pin.model';
import {PinsService} from '../../pins/pins.service';
import {Router} from "@angular/router";
import {LoadingController, ModalController, NavController} from "@ionic/angular";
import {PinModalComponent} from "../../profile/my-pins/pin-modal/pin-modal.component";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-pin-element',
  templateUrl: './pin-element.component.html',
  styleUrls: ['./pin-element.component.scss'],
})
export class PinElementComponent implements OnInit, OnDestroy {
  @Input() pin: Pin;
  route: string;
  private userSub: Subscription;
  private UID: string;

  constructor(private pinsService: PinsService,
              private router: Router, private loadingCtrl: LoadingController,
              private navCtrl: NavController, private modalCtrl: ModalController,
              private authService: AuthService) {
    this.route = router.url;
  }

  ngOnInit() {
    this.userSub = this.authService.userId.subscribe(id => this.UID = id);
  }

  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

  public like(): void {
    this.loadingCtrl
      .create()
      .then((loadingEl) => {
        loadingEl.present();
        this.pinsService
          .editPin(
            this.pin.id,
            this.pin.author,
            this.pin.text,
            this.pin.imageUrl,
            this.pin.userId,
            this.pin.savedBy,
            this.pin.likedBy.concat(this.UID)
          )
          .subscribe((pins) => {
            loadingEl.dismiss();
          });
      });
  }

  public save(): void {
    this.loadingCtrl
      .create()
      .then((loadingEl) => {
        loadingEl.present();
        this.pinsService
          .editPin(
            this.pin.id,
            this.pin.author,
            this.pin.text,
            this.pin.imageUrl,
            this.pin.userId,
            this.pin.savedBy.concat(this.UID),
            this.pin.likedBy
          )
          .subscribe((pins) => {
            loadingEl.dismiss();
          });
      });
  }

  public isSaved(): boolean {
    if(this.pin.savedBy.includes(this.UID)){
      return true;
    }
    return false;
  }

  public isMine(): boolean {
    if(this.pin.userId === this.UID){
      return true;
    }
    return false;
  }

  isLiked(): boolean {
    if(this.pin.likedBy.includes(this.UID)){
      return true;
    }
    return false;
  }

  delete() {
    this.loadingCtrl.create({message: 'Deleting...'}).then(loadingEl => {
      loadingEl.present();
      this.pinsService.deletePin(this.pin.id).subscribe(() => {
        loadingEl.dismiss();
        this.navCtrl.navigateBack('/profile/tabs/my-pins');
      });
    });
  }

  edit() {
    this.modalCtrl
      .create({
        component: PinModalComponent,
        componentProps: {title: 'Edit pin', description: this.pin.text, url: this.pin.imageUrl, buttonName: 'Confirm'},
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({message: 'Editing...'})
            .then((loadingEl) => {
              loadingEl.present();
              this.pinsService
                .editPin(
                  this.pin.id,
                  this.pin.author,
                  resultData.data.pinData.description,
                  resultData.data.pinData.url,
                  this.pin.userId,
                  this.pin.savedBy,
                  this.pin.likedBy
                )
                .subscribe((pins) => {
                  this.pin.text = resultData.data.pinData.description;
                  this.pin.imageUrl = resultData.data.pinData.url;
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  removeFromFavorites() {
    this.loadingCtrl
      .create()
      .then((loadingEl) => {
        loadingEl.present();
        this.pinsService
          .editPin(
            this.pin.id,
            this.pin.author,
            this.pin.text,
            this.pin.imageUrl,
            this.pin.userId,
            this.pin.savedBy.filter(uid => uid !== this.UID),
            this.pin.likedBy
          )
          .subscribe((pins) => {
            loadingEl.dismiss();
          });
      });
  }
}
