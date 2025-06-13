import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.scss'
})
export class ResultatComponent implements OnInit {

  resultatSimplifieForm!: FormGroup;
  filtreResultatSimplifieForm!: FormGroup;

  resultatData = [];
  resutatDisplayedData = [];
  comptesCharges = [];
  comptesProduits = [];
  totalCharges = 0;
  totalProduits = 0;

  organisation: any = null;
  user_parsed = null;

  ShowPrintResultatSimplifieBtn:boolean = true;

  //Filtre 
  showRemoveFiltreBtn: boolean = false;
  showFilterSection: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.resultatSimplifieForm = new FormGroup({
      resultat_simplifie_exercice: new FormControl(null, [
        Validators.required,
      ]),
    });

    this.filtreResultatSimplifieForm = new FormGroup({
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
  get_grand_livre_data(exercice_id:any, date_debut:string=null, date_fin:string=null){
    
    this.organisationService.get_grandivre_data(exercice_id, date_debut, date_fin).subscribe(
      (grandlivreData: any) => {
        this.resutatDisplayedData = [];
        this.comptesCharges = [];
        this.comptesProduits = [];
        this.totalCharges = 0;
        this.totalProduits = 0;

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
          if ((compte.num_class == 6) && (compte.debit != compte.credit)) {
            this.comptesCharges.push(compte);
            this.totalCharges += Math.abs((parseFloat(compte.debit) - parseFloat(compte.credit)));
          } else if ((compte.num_class == 7) && (compte.debit != compte.credit)) {
            this.comptesProduits.push(compte);
            this.totalProduits += Math.abs((parseFloat(compte.debit) - parseFloat(compte.credit)));
          }
        });

        this.ShowPrintResultatSimplifieBtn = false;

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
  get_resultat_data() {

    if (this.resultatSimplifieForm.invalid) {
      return;
    }
    if (this.resultatSimplifieForm.value.resultat_simplifie_exercice == "") {
      return;
    }

    this.get_grand_livre_data(this.resultatSimplifieForm.get('resultat_simplifie_exercice').value);

    this.showFilterSection = true;

  }


  //Filtre resultat simplifié
  filtre_resultat_simplfie() {

    if (this.resultatSimplifieForm.invalid) {
      return;
    }
    if (this.resultatSimplifieForm.value.resultat_simplifie_exercice == "") {
      return;
    }

    this.get_grand_livre_data(this.resultatSimplifieForm.get('resultat_simplifie_exercice').value, this.filtreResultatSimplifieForm.get('filtre_date_debut').value, this.filtreResultatSimplifieForm.get('filtre_date_fin').value);

  }


  //Remove resultat simplifié filtre
  remove_resultat_simplifie_filtre(){
    this.get_resultat_data();
    this.filtreResultatSimplifieForm.reset();
  }


  //Export Resultat simplifié Format Excel
    exportExcelResultatSimplifie(){
      const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(document.getElementById('table_resultat_simplifie'));
      var ws = workbook.Sheets["resultat_simplifie"];
      // save to file
      XLSX.writeFile(workbook, 'resultat_simplifie.xlsx');
    }

}
