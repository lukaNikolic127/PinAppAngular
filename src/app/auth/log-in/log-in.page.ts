import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm) {
    this.isLoading = true;
    // console.log(form);
    this.authService.logIn(form.value).subscribe(resData => {
      // console.log(resData);
      this.isLoading = false;
      this.router.navigateByUrl('/pins');
    },
      errRes => {
        // console.log(errRes);
        this.isLoading = false;
        let message = "Incorrect email or password!";

        this.alertCtrl.create({
          header: "Authentication failed",
          message: message,
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
        });
        form.reset();
      });
  }
}
