import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController, private http: HttpClient) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)])
    });
  }

  onRegister() {
    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe(resData => {
      // console.log(resData);
      this.isLoading = false;
      this.router.navigateByUrl('/pins');
    },
      errRes => {
        this.isLoading = false;
        const code = errRes.error.error.message;
        let message;
        switch(code){
          case 'EMAIL_EXISTS':
            message = 'User already exists!';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            message = 'Requests from this device are blocked. Try again later.';
            break;
          default:
            message = 'Unknown error occurred.';
            break;
        }
        this.alertCtrl.create({
          header: "Registration failed",
          message: message,
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
        });
        this.registerForm.reset();
      });
  }
}
