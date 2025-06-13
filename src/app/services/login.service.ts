import { Injectable } from '@angular/core';
import { ApiConfig } from '../configs/api.config';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
export interface LoginForm {
  username: string;
  password: string;
}
export interface LoginFormFirst {
  username: string;
  password1: string;
  password2: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  secretKey = 'secret_J2ZiF-0fb-t7tNL9Na6sQvnrDjift_BT2fLTagFFlfc';

  private readonly urlPath = ApiConfig.url;

  constructor(
    private http: HttpClient,
  ) { }


  //Connect with email and password
  login(loginForm: LoginForm) {
    return this.http.post(this.urlPath + 'api/auth/local/signin',
      {
        email: loginForm.username.trim(),
        password: loginForm.password.trim(),
      },
    ).pipe()
  }

  //Connect with email and password
  login_first(loginForm: LoginFormFirst) {

    return this.http.post(this.urlPath + 'api/auth/local/signin-first',
      {
        email: loginForm.username.trim(),
        password: loginForm.password1.trim(),
      },
    ).pipe()
  }

  // Fonction pour chiffrer le JWT
  encryptSTR(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  // Fonction pour déchiffrer le JWT
  decryptSTR(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
