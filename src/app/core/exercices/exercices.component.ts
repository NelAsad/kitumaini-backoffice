import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'src/app/services/organisation.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-exercices',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './exercices.component.html',
  styleUrl: './exercices.component.scss'
})
export class ExercicesComponent implements OnInit {

  exerciceForm!: FormGroup;

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

    this.exerciceForm = new FormGroup({
      libelle_exercice: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      date_debut_exercice: new FormControl(null, [
        Validators.required,
      ]),
      date_fin_exercice: new FormControl(null, [
        Validators.required,
      ]),
      exercice_devise_de_base: new FormControl("", [
        Validators.required,
      ]),
      exercice_organisation: new FormControl("", [
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

  // Save exercice
  save_exercice() {

    this.exerciceForm.get('exercice_organisation').setValue(String(this.user_parsed.organisation.id));

    if (this.exerciceForm.invalid) {
      return;
    }
    if (this.exerciceForm.value.exercice_organisation == "" || this.exerciceForm.value.exercice_devise_de_base == "") {
      return;
    }
    this.organisationService.save_exercice(this.exerciceForm.value).subscribe(
      (result: any) => {
        this.exerciceForm.reset();
        this.get_one_organisation();
        window.alert('Exercice ajouté');
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
