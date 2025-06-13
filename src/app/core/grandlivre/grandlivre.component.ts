import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { roundNumberPipe } from 'src/app/commons/pipes/round.pipe';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-grandlivre',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule, roundNumberPipe],
  templateUrl: './grandlivre.component.html',
  styleUrl: './grandlivre.component.scss'
})
export class GrandlivreComponent implements OnInit {

  grandlivreForm!: FormGroup;
  filtreGrandLivreForm!: FormGroup;

  exercices = [];
  grandlivreData = [];
  grandlivreDisplayedData = [];
  grandlivreDisplayedDataTrier = [];
  ecrituresDisplayedData = [];

  // Pour le grand livre
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalSolde: number = 0;

  // Pour le compte
  totalCompteDebit: number = 0;
  totalCompteCredit: number = 0;

  showCompteDetails: boolean = false;
  ShowPrintGrandLivreBtn: boolean = true;

  organisation: any = null;
  user_parsed = null;

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

    this.grandlivreForm = new FormGroup({
      grand_livre_exercice: new FormControl(null, [
        Validators.required,
        // Validators.minLength(3),
      ]),
    });

    this.filtreGrandLivreForm = new FormGroup({
      filtre_date_debut: new FormControl(null, []),
      filtre_date_fin: new FormControl(null, []),
    });

    this.get_one_organisation();

  }


  //get One organisation
  get_one_organisation() {
    this.organisationService.get_one_organisation(this.user_parsed.organisation.id).subscribe(
      (organisation: any) => {
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
        this.grandlivreData = grandlivreData;

        console.log(grandlivreData);

        this.totalDebit = 0;
        this.totalCredit = 0;
        this.totalSolde = 0;

        this.grandlivreDisplayedData = grandlivreData.map(compte => {
          return {
            num_class: compte.numeroClasse,
            num_compte: compte.numeroCompte,
            libelle_compte: compte.libelleCompte,
            debit: this.arrondir(parseFloat(compte.debit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.debit) * parseFloat(num.taux)), 0)), 5),
            credit: this.arrondir(parseFloat(compte.credit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.credit) * parseFloat(num.taux)), 0)), 5),
            solde: this.arrondir((parseFloat(compte.debit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.debit) * parseFloat(num.taux)), 0))) - (parseFloat(compte.credit) + parseFloat(compte.ecriture_items.reduce((acc, num) => acc + (parseFloat(num.credit) * parseFloat(num.taux)), 0))), 5),
          }
        });

        this.totalDebit += this.arrondir(parseFloat(this.grandlivreDisplayedData.reduce((acc, compte) => acc + compte.debit, 0)), 5);
        this.totalCredit += this.arrondir(parseFloat(this.grandlivreDisplayedData.reduce((acc, compte) => acc + compte.credit, 0)), 5);
        this.totalSolde += this.arrondir(parseFloat(this.grandlivreDisplayedData.reduce((acc, compte) => acc + compte.solde, 0)), 5);

        // filtre sur la classe
        this.grandlivreDisplayedDataTrier = this.grandlivreDisplayedData.sort((a, b) =>
          a.num_class - b.num_class
        );
        // filtre sur le numero de compte
        this.grandlivreDisplayedDataTrier = this.grandlivreDisplayedData.sort((a, b) =>
          String(a.num_compte).localeCompare(String(b.num_compte))
        );

      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }

  //Get all exercices without pagination
  afficher_grand_livre_pour_exercice() {

    if (this.grandlivreForm.invalid) {
      return;
    }
    if (this.grandlivreForm.value.grand_livre_exercice == "") {
      return;
    }

    this.get_grand_livre_data(this.grandlivreForm.get('grand_livre_exercice').value);

    
    this.ShowPrintGrandLivreBtn = false;
    this.showFilterSection = true;

  }


  // Back sur la liste des comptes (Grand livre)
  voir_compte(num_compte: string) {
    this.totalCompteDebit = 0;
    this.totalCompteCredit = 0;

    this.ecrituresDisplayedData = this.grandlivreData.find(compte => compte.numeroCompte == num_compte);

    console.log(this.ecrituresDisplayedData);

    this.totalCompteDebit += this.ecrituresDisplayedData['debit'];
    this.totalCompteCredit += this.ecrituresDisplayedData['credit'];

    this.totalCompteDebit += parseFloat(this.ecrituresDisplayedData['ecriture_items'].reduce((acc, ecriture) => acc + (parseFloat(ecriture.debit) * parseFloat(ecriture.taux)), 0));
    this.totalCompteCredit += parseFloat(this.ecrituresDisplayedData['ecriture_items'].reduce((acc, ecriture) => acc + (parseFloat(ecriture.credit) * parseFloat(ecriture.taux)), 0));

    console.log(this.totalCompteDebit);
    console.log(this.totalCompteCredit);

    this.showCompteDetails = true;
  }

  retour_sur_grandlivre() {
    this.showCompteDetails = false;
  }

  //Filtre grand livre
  filtre_grand_livre() {

    if (this.grandlivreForm.invalid) {
      return;
    }
    if (this.grandlivreForm.value.grand_livre_exercice == "") {
      return;
    }

    this.get_grand_livre_data(this.grandlivreForm.get('grand_livre_exercice').value, this.filtreGrandLivreForm.get('filtre_date_debut').value, this.filtreGrandLivreForm.get('filtre_date_fin').value);

  }

  //Remove grand livre filtre
  remove_grand_livre_filtre(){
    this.afficher_grand_livre_pour_exercice();
    this.filtreGrandLivreForm.reset();
  }


  //Export Grand Livre Format Excel
  exportExcelGrandLivre() {
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(document.getElementById('table_grandlivre'));
    var ws = workbook.Sheets["grand_livre"];
    // save to file
    XLSX.writeFile(workbook, 'grand_livre.xlsx');
  }


  //Export details compte Format Excel
  exportExcelCompteDetails() {
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(document.getElementById('table_grand_livre_compte'));
    var ws = workbook.Sheets["compte"];
    // save to file
    XLSX.writeFile(workbook, 'grand_livre_compte.xlsx');
  }


  //Arrondir les nombres
  arrondir(value: number, decimals:number){
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

}
