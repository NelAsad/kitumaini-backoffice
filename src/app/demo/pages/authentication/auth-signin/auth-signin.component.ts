import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule,
    ReactiveFormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit {

  alertShow: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
    });
  }


  //User connexion
  connect() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe(
      (user: any) => {
        const data_at_decoded: any = jwtDecode(user['access_token']);
        const data_rt_decoded: any = jwtDecode(user['refresh_token']);

        // Set data in localStorage
        localStorage.setItem('user_data', this.loginService.encryptSTR(JSON.stringify(data_at_decoded)));
        localStorage.setItem('access_token', this.loginService.encryptSTR(user['access_token']));
        localStorage.setItem('refresh_token', this.loginService.encryptSTR(user['refresh_token']));

        if (data_at_decoded.sub) {
          // this.router.navigate(['dashboard']);
          window.location.href = '/dashboard';
        } else {
          this.alertShow = true;
          this.loginForm.value.password = null;
        }

      },
      (err: any) => {
        if (err.error.statusCode == 401 || err.error.statusCode == 403) {
          if (err.error.message == "nouveau_utilisateur") {
            window.location.href = '/auth/signin-first';
          } else {
            this.alertShow = true;
          }
        }
      }
    )
  }



}
