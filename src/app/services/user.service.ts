import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../configs/api.config';

export interface userForm {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  organisation: string;
  site: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly urlPath = ApiConfig.url;

  constructor(
    private http: HttpClient,
  ) { }

  //Save user
  save_user(user: userForm) {
    return this.http.post(this.urlPath + 'api/auth/local/signup',
      {
        name: user.name.trim(),
        username: user.username.trim(),
        email: user.email.trim(),
        role: user.role.trim(),
        password: user.password.trim(),// cote back, on va generer un mot de passe quand la chaine password est vide.
        organisation: user.organisation.trim(),
        site: user.site,
      },
    ).pipe();
  }

  //Changer le statut de l'utilisateur
  change_user_state(user_id: number, state: boolean) {
    return this.http.post(this.urlPath + 'api/users/change_state',
      {
        id: user_id,
        state: state,
      },
    ).pipe();
  }



}
