// angular import
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {

  iduser: any = '';
  name: any = '';
  email: any = '';
  username: any = '';
  role: any = '';

  constructor(
    private router: Router,
    private loginService : LoginService
  ) { }

  ngOnInit() {
    const user: any = localStorage.getItem('user_data');
    const user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    console.log(user_parsed);
    
    this.iduser = user_parsed.sub;
    this.name = user_parsed.nom + ' ' + user_parsed.prenom;
    this.email = user_parsed.email;
    this.username = user_parsed.username;
    this.role = user_parsed.role;
  }

  //Logout
  logout(){
    // Vide la localStorage
    localStorage.clear();
    this.router.navigate(['auth/signin']);
  }
}
