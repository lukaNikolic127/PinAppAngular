import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-pin-modal',
  templateUrl: './pin-modal.component.html',
  styleUrls: ['./pin-modal.component.scss'],
})
export class PinModalComponent implements OnInit {

  @ViewChild('uploadForm', {static: true}) form: NgForm;
  @Input() title: string;
  @Input() description: string;
  @Input() url: string;
  @Input() buttonName: string = 'Upload';

  private userEmailSub: Subscription;
  email: string;

  constructor(private modalCtrl: ModalController, private authService: AuthService) { }

  ngOnInit() {
    this.userEmailSub = this.authService.userEmail.subscribe(email => this.email = email);
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  onUpload() {

    if(!this.form.valid){
      return;
    }

    this.modalCtrl.dismiss({pinData: {
        author: this.email,
        description: this.form.value['description'],
        url: this.form.value['url'],
        savedBy: ['user'],
        likedBy: ['user']
        }
      }, 'confirm');
  }
}
