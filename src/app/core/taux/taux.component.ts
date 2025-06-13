import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'src/app/services/organisation.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-taux',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './taux.component.html',
  styleUrl: './taux.component.scss'
})
export class TauxComponent implements OnInit {

  tauxForm!: FormGroup;

  organisation: any = null;
  user_parsed = null;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {

    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.tauxForm = new FormGroup({
      date_taux: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      devise_taux: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      taux_de_change: new FormControl(null, [
        Validators.required,
      ]),
      taux_exercice: new FormControl("", [
        Validators.required,
      ]),
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


  save_taux_du_jour() {

    this.organisationService.get_check_taux_exist_for_date(this.tauxForm.value.date_taux, this.tauxForm.value.devise_taux, this.tauxForm.value.taux_exercice).subscribe(
      (result: any) => {
        console.log(result);

        if (!result) {
          this.organisationService.set_taux_du_jour(this.tauxForm.value).subscribe(
            (taux: any) => {
              this.tauxForm.reset();
              alert('Taux défini pour la journée');
              console.log(taux);
            },
            (err: any) => {
              console.log(err);
            }
          );
        } else {
          alert('Pour cette devise, Un taux est déjà défini pour ce date')
        };

      },
      (err: any) => {
        console.log(err);
      }
    )
  }

}
