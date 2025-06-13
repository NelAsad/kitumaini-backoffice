import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  alertShow:boolean = false;
  loginForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ){}

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
  connect(){
    if (this.loginForm.invalid) {
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe(
      (user: any) => {
        const data_at_decoded: any = jwtDecode(user['access_token']);
        const data_rt_decoded: any = jwtDecode(user['refresh_token']);

        console.log(data_at_decoded);
        
        // Set data in localStorage
        localStorage.setItem('user_data',JSON.stringify(data_at_decoded));
        localStorage.setItem('access_token',user['access_token']);
        localStorage.setItem('refresh_token',user['refresh_token']);

        if (data_at_decoded.sub) {
          // this.router.navigate(['dashboard']);
          window.location.href = '/dashboard';
        }else{
          this.alertShow = true;
        } 
        
      },
      (err: any) => {
        if (err.error.statusCode == 401 || err.error.statusCode == 403) {
          this.alertShow = true;
        }
      }
    )
  }



}
