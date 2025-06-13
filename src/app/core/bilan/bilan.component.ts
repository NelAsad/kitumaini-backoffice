import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-bilan',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './bilan.component.html',
  styleUrl: './bilan.component.scss'
})
export class BilanComponent implements OnInit {

  bilanForm!: FormGroup;
  filtreBilanForm!: FormGroup;

  resultatData = [];
  resutatDisplayedData = [];

  somme_immo_incorpo = 0;
  somme_immo_corpo = 0;
  somme_immo_fin = 0;
  somme_stocks = 0;
  somme_creances = 0;
  somme_disponibilites = 0;

  somme_capital_social = 0;
  somme_reserves = 0;
  somme_resultat_exercice = 0;
  somme_emprunt_bancaire = 0;
  somme_dettes_fournisseur = 0;
  somme_dettes_fisca_soc = 0;

  // // Actif Immobilisé
  // immobilisations_incorporelles = 0;
  // immobilisations_corporelles = 0;
  // immobilisations_financieres = 0;
  // // Actif Circulant
  // stocks_et_en_cours = 0;
  // creances_clients = 0;
  // autres_créances = 0;
  // tresorerie_active = 0;

  // // Capitaux Propres
  // capital_social = 0;
  // reserves = 0;
  // resultat_net = 0;
  // // Dettes à Long Terme
  // emprunts_bancaires = 0;
  // // Dettes à Court Terme
  // dettes_fournisseurs = 0;
  // dettes_fiscales_et_sociales = 0;
  // autres_dettes = 0;

  // //Totaux
  // total_actif = 0;
  // total_passif = 0;

  organisation: any = null;
  user_parsed = null;

  ShowPrintBilanBtn: boolean = true;

  showFilterSection:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.bilanForm = new FormGroup({
      bilan_exercice: new FormControl(null, [
        Validators.required,
      ]),
    });

    this.filtreBilanForm = new FormGroup({
      filtre_date_debut: new FormControl(null, []),
      filtre_date_fin: new FormControl(null, []),
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


  //Get grand livre data
  get_grand_livre_data(exercice_id: any, date_debut: string = null, date_fin: string = null) {

    this.organisationService.get_grandivre_data(exercice_id, date_debut, date_fin).subscribe(
      (grandlivreData: any) => {


        // les sommes des rubriques des 
        this.somme_immo_incorpo = 0;
        this.somme_immo_corpo = 0;
        this.somme_immo_fin = 0;
        this.somme_stocks = 0;
        this.somme_creances = 0;
        this.somme_disponibilites = 0;

        this.somme_capital_social = 0;
        this.somme_reserves = 0;
        this.somme_resultat_exercice = 0;
        this.somme_emprunt_bancaire = 0;
        this.somme_dettes_fournisseur = 0;
        this.somme_dettes_fisca_soc = 0;

        this.resultatData = grandlivreData;


        this.resutatDisplayedData = grandlivreData.map(compte => (
          {
            num_class: compte.numeroClasse,
            num_compte: compte.numeroCompte,
            libelle_compte: compte.libelleCompte,
            debit: parseFloat(compte.debit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.debit) * parseFloat(num.taux)), 0)),
            credit: parseFloat(compte.credit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.credit) * parseFloat(num.taux)), 0)),
            solde: (parseFloat(compte.debit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.debit) * parseFloat(num.taux)), 0))) - (parseFloat(compte.credit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.credit) * parseFloat(num.taux)), 0))),
          }
        ));

        this.resutatDisplayedData.forEach(compte => {

          // Immo incorpo
          if (compte.num_compte.slice(0, 2) == "20" || compte.num_compte.slice(0, 2) == "21") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_immo_incorpo += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Immo corpo
          if (compte.num_compte.slice(0, 2) == "22" || compte.num_compte.slice(0, 2) == "23" || compte.num_compte.slice(0, 2) == "24") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_immo_corpo += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Immo financieres
          if (compte.num_compte.slice(0, 2) == "25" || compte.num_compte.slice(0, 2) == "26" || compte.num_compte.slice(0, 2) == "27") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_immo_fin += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Stocks
          if (compte.num_compte.slice(0, 2) == "31" || compte.num_compte.slice(0, 2) == "32" || compte.num_compte.slice(0, 2) == "33" || compte.num_compte.slice(0, 2) == "34" || compte.num_compte.slice(0, 2) == "35" || compte.num_compte.slice(0, 2) == "36") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_stocks += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Creances
          if (compte.num_compte.slice(0, 2) == "41") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_creances += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Disponibilites
          if (compte.num_compte.slice(0, 2) == "56" || compte.num_compte.slice(0, 2) == "57" || compte.num_compte.slice(0, 2) == "52") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_disponibilites += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Capital social
          if (compte.num_compte.slice(0, 2) == "10") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_capital_social += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Reserves
          if (compte.num_compte.slice(0, 2) == "11") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_reserves += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Resultat de l'exercice
          if (compte.num_compte.slice(0, 2) == "13") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_resultat_exercice += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Emprunt bancaire
          if (compte.num_compte.slice(0, 2) == "16") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_emprunt_bancaire += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Dettes fournisseurs
          if (compte.num_compte.slice(0, 2) == "40") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_dettes_fournisseur += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }
          // Dettes fiscales et sociales
          if (compte.num_compte.slice(0, 2) == "42" || compte.num_compte.slice(0, 2) == "43" || compte.num_compte.slice(0, 2) == "44" || compte.num_compte.slice(0, 2) == "45" || compte.num_compte.slice(0, 2) == "46") {
            if ((parseFloat(compte.debit) - parseFloat(compte.credit)) != 0) {
              this.somme_dettes_fournisseur += (parseFloat(compte.debit) - parseFloat(compte.credit));
            }
          }

        });


        this.ShowPrintBilanBtn = false;


      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }


  //Get tous les comptes du plan
  get_bilan_data() {

    if (this.bilanForm.invalid) {
      return;
    }
    if (this.bilanForm.value.bilan_exercice == "") {
      return;
    }

    this.get_grand_livre_data(this.bilanForm.get('bilan_exercice').value);

    this.showFilterSection = true;

  }


  //Filtre bilan
  filtre_bilan() {

    if (this.bilanForm.invalid) {
      return;
    }
    if (this.bilanForm.value.bilan_exercice == "") {
      return;
    }

    this.get_grand_livre_data(this.bilanForm.get('bilan_exercice').value, this.filtreBilanForm.get('filtre_date_debut').value, this.filtreBilanForm.get('filtre_date_fin').value);

  }

  remove_bilan_filtre(){

  }


  //Export Bilan Format Excel
  exportExcelBilan() {
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(document.getElementById('table_bilan'));
    var ws = workbook.Sheets["bilan"];
    // save to file
    XLSX.writeFile(workbook, 'bilan.xlsx');
  }


}
