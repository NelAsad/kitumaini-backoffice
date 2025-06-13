import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { UserService } from 'src/app/services/user.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

export enum UserRole {
  ORG_ADMIN = 'organisation_admin',
  ORG_COMPT_SENIOR = 'organisation_comptable_senior',
  ORG_COMPT_SITE = 'organisation_comptable_site',
  ORG_COMPT_COLLAB = 'organisation_comptable_collab',
}

@Component({
  selector: 'app-organisation-manage-users',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './organisation-manage-users.component.html',
  styleUrl: './organisation-manage-users.component.scss'
})
export class OrganisationManageUsersComponent implements OnInit {

  userForm!: FormGroup;

  organisation: any = null;

  user_parsed = null;

  roles = [
    ['ORG_ADMIN', "ADMINISTRATEUR DE L'ORGANISATION", "organisation_admin"],
    ['ORG_COMPT_SENIOR', "COMPTABLE SENIOR", "organisation_comptable_senior"],
    ['ORG_COMPT_SITE', "COMPTABLE RESPONSABLE DU SITE", "organisation_comptable_site"],
    ['ORG_COMPT_COLLAB', "COMPTABLE COLLABORATEUR", "organisation_comptable_collab"],
  ]

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.userForm = new FormGroup({
      name: new FormControl(null, []),
      username: new FormControl(null, []),
      email: new FormControl(null, []),
      password: new FormControl(null, []),
      role: new FormControl(0, []),
      organisation: new FormControl(null, []),
      site: new FormControl(0, []),
    });

    this.get_one_organisation();

  }

  //get One organisation
  get_one_organisation() {

    this.organisationService.get_one_organisation(this.user_parsed.organisation.id).subscribe(
      (organisation: any) => {
        console.log(organisation);
        this.organisation = organisation;
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }

  save_user() {

    this.userForm.get('organisation').setValue(String(this.user_parsed.organisation.id));
    this.userForm.get('role').setValue((this.roles.find(role => role[0] == this.userForm.get('role')?.value))[2]);

    if (this.userForm.invalid) {
      return;
    }
    if (this.userForm.value.site_organisation == "") {
      return;
    }

    this.userService.save_user(this.userForm.value).subscribe(
      (result: any) => {
        this.userForm.reset();
        this.get_one_organisation();
        window.alert('Utilisateur ajouté');
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }


  //Voir le user avec tous les details
  explorer_user(user_id:number){
    console.log('Explore user');
    //Utiliser un modal pour afficher l'utilisateur avec possibilité de modifier.. sauf le password
  }

  //Changer statut user
  changer_statut_user(user_id:number, user_state:boolean){
    this.userService.change_user_state(user_id, user_state).subscribe(
      (result: any) => {
        this.userForm.reset();
        this.get_one_organisation();
        window.alert('Statut changé');
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }

}
