import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganisationService } from 'src/app/services/organisation.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss'
})
export class OrganisationComponent implements OnInit {

  organisationForm!: FormGroup;
  organisations = []

  user_parsed = null;

  constructor(
    private organisationService: OrganisationService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.get_all_organisation();

    this.organisationForm = new FormGroup({
      organisation_nom: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  //Get all organisation without pagination
  get_all_organisation() {
    this.organisationService.get_all_organisation().subscribe(
      (organisations: any) => {
        this.organisations = organisations;
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
          // this.alertShow = true;
        // }
      }
    )
  }

  // Save organisation
  save_organisation(){
    if (this.organisationForm.invalid) {
      return;
    }
    this.organisationService.save_organisation(this.organisationForm.value, this.user_parsed.sub).subscribe(
      (result: any) => {
        this.organisationForm.reset();
        this.get_all_organisation();
        window.alert('Organisation ajoutée'); // test le type de retour avant d'afficher le message
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
          // this.alertShow = true;
        // }
      }
    )
  }

  //Explorer une organisation
  explorer_organisation(organisationId:string): void {
    this.router.navigate(['/organisation', organisationId]);
  }

}
