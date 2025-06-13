import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-first',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-first.component.html',
  styleUrl: './login-first.component.scss'
})
export class LoginFirstComponent implements OnInit {

  alertShow: boolean = false;
  alertMsg: string = "";
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
      password1: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      password2: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
    });
  }


  //User connexion
  connect() {
    if (this.loginForm.invalid) {
      this.alertShow = true;
      this.alertMsg = "Remplir tous les champs obligatoires";
    } else if (this.loginForm.value.password1 != this.loginForm.value.password2) {
      this.alertShow = true;
      this.alertMsg = "Mot de passe different de sa confirmation";
    } else {
      this.loginService.login_first(this.loginForm.value).subscribe(
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
            this.alertMsg = "Identifiants de connexion invalides";
            this.loginForm.value.password = null;
          }

        },
        (err: any) => {
          if (err.error.statusCode == 401 || err.error.statusCode == 403) {
            this.alertMsg = err.error.message;
            this.alertShow = true;
          }
        }
      );
    }


  }

}
