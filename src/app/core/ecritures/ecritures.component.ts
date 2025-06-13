import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'src/app/services/organisation.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-ecritures',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ecritures.component.html',
  styleUrl: './ecritures.component.scss'
})
export class EcrituresComponent implements OnInit {

  ecrituresForm!: FormGroup;
  selected_exercice = null;
  selected_plan_comptes = [];
  devise_de_base = null;

  //Tableaux des ecritures (2 initiales)
  tableaux_ecritures = [];

  organisation: any = null;
  user_parsed = null;

  //Definir le site (Uniquement pour le comptabe senior)
  hide_site_field: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {

    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    if (this.user_parsed['role'] == 'organisation_comptable_senior') {
      this.hide_site_field = false;
    }

    this.ecrituresForm = new FormGroup({
      ecriture_site: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      ecriture_journal: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      ecriture_exercice: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      ecriture_date_operation: new FormControl(null, [
        Validators.required,
      ]),
      ecriture_libelle: new FormControl(null, [
        Validators.required,
      ]),
    });

    this.tableaux_ecritures.push([1, '', '', '0', '0', '', '', '']);
    this.tableaux_ecritures.push([2, '', '', '0', '0', '', '', '']);

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

  on_date_operation_change($event) { // Pour eviter qu'une personne trafique les taux en changeant de date
    //Tableaux des ecritures (2 initiales)
    console.log('here');

    this.tableaux_ecritures = [];
    this.tableaux_ecritures.push([1, '', '', '0', '0', '', '', '']);
    this.tableaux_ecritures.push([2, '', '', '0', '0', '', '', '']);
  }


  // get selected exercice
  get_selected_exercice(event: any) {
    let selectedId: any = event.target.value;
    this.selected_exercice = null;

    console.log(selectedId);

    this.organisation.exercices.forEach(exercice => {
      if (exercice.id == selectedId) {

        console.log(exercice);

        this.selected_exercice = exercice;
        this.selected_plan_comptes = exercice.plan[0].plan_items;
        this.devise_de_base = exercice.devise_de_base;
      }
    });

    console.log(this.selected_plan_comptes);

  }

  get_selected_compte(event, current_index) {
    let numeroCompte: any = event.target.value;
    console.log(event.target.value);

    this.selected_plan_comptes.forEach((compte) => {
      if (compte['numeroCompte'] == numeroCompte) {
        // if (compte['numeroCompte'] ==  numeroCompte) {
        this.tableaux_ecritures[current_index][2] = compte['libelleCompte'];
      }
    });

  }


  //change taux de l'operation
  change_taux_operation(event, current_index) {
    let taux_op: any = event.target.value;

    if (this.tableaux_ecritures[current_index][5] != this.devise_de_base) {
      this.organisationService.get_check_taux_exist_for_date(this.ecrituresForm.value.ecriture_date_operation, taux_op, this.selected_exercice.id).subscribe(
        (result: any) => {
          if (result) {
            console.log(result);
            this.tableaux_ecritures[current_index][7] = result.taux_de_change;
          } else {
            this.tableaux_ecritures[current_index][7] = 0;
            alert('Définir un taux pour cette devise en cette date');
          }
        },
        (err: any) => {
          console.log(err);
        }
      )
    } else {
      this.tableaux_ecritures[current_index][7] = 1;
    }


  }

  //ajout d'une ligne vide
  addRow() {
    let addedid;
    if (this.tableaux_ecritures.length == 0) {
      addedid = 1;
    } else {
      addedid = this.tableaux_ecritures[this.tableaux_ecritures.length - 1][0] + 1;
    }
    this.tableaux_ecritures.push([addedid, '', '', '0', '0', '', '', '']);
  }

  //suppression d'une ligne
  deleterow(rowId) {
    this.tableaux_ecritures.forEach((el, index, array) => {
      if (el[0] == rowId) {
        array.splice(index, 1);
      }
    });
  }


  save_ecritures() {

    if (window.confirm("Valider l'écriture ?")) {
      // Date op valide
      if (this.ecrituresForm.value.ecriture_date_operation == '') {
        alert('Date d operation pas valide');
      } else
        // libelle 
        if (this.ecrituresForm.value.ecriture_libelle == '') {
          alert('Le libellé ne doit pas être vide');
        } else
          // journal 
          if (this.ecrituresForm.value.ecriture_libelle == '') {
            alert('Choisir un journal');
          } else {

            // Check equilibre exercices et not null
            let somme_credit = 0;
            let somme_debit = 0;
            this.tableaux_ecritures.forEach(ecriture_row => {

              if (ecriture_row[5] == this.devise_de_base) {
                console.log('in side');

                somme_debit += parseFloat(ecriture_row[3]);
                somme_credit += parseFloat(ecriture_row[4]);
              }
              //Si devises differentes
              else {
                //Une unité de la monnaie d'op est egal à combien d'unités de la monnaie de base
                somme_debit += parseFloat(ecriture_row[3]) * parseFloat(ecriture_row[7]);
                somme_credit += parseFloat(ecriture_row[4]) * parseFloat(ecriture_row[7]);
              }
            });

            if (somme_debit != somme_credit) {
              alert('Pas equilibre');
            } else {

              this.organisationService.save_ecritures(this.ecrituresForm.value, this.tableaux_ecritures, this.devise_de_base, this.user_parsed.sub, (this.user_parsed['role'] == 'organisation_comptable_senior')? this.ecrituresForm.value.ecriture_site : this.user_parsed?.site?.id).subscribe(
                (result: any) => {
                  alert('Ecritures enregistrées');
                  console.log(result);
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

    }


  }





}
