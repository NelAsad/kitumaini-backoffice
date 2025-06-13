import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'src/app/services/organisation.service';
import { LoginService } from 'src/app/services/login.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-journals',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './journals.component.html',
  styleUrl: './journals.component.scss'
})
export class JournalsComponent implements OnInit {

  journalForm!: FormGroup;
  filtreJournalForm!: FormGroup;

  selectedJournalEcritures = [];
  selectedJournalEcrituresTrier = null;
  totalDebit = 0;
  totalCredit = 0;

  showJournalDetails: boolean = false;

  organisation: any = null;
  user_parsed = null;

  journal_filtre_type: string = "1";
  selected_journal_id: number = null;
  showRemoveFiltreBtn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {

    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.journalForm = new FormGroup({
      libelle_journal: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      journal_organisation: new FormControl("", [
        Validators.required,
      ]),
    });

    this.filtreJournalForm = new FormGroup({
      filtre_libelle_date_debut: new FormControl(null, []),
      filtre_libelle_date_fin: new FormControl(null, []),
      filtre_journal_exercice: new FormControl("", []),
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


  // Save journal
  save_journal() {
    this.journalForm.get('journal_organisation').setValue(String(this.user_parsed.organisation.id));

    if (this.journalForm.invalid) {
      return;
    }
    if (this.journalForm.value.journal_organisation == "") {
      return;
    }
    this.organisationService.save_journal(this.journalForm.value).subscribe(
      (result: any) => {
        this.journalForm.reset();
        this.get_one_organisation();
        window.alert('Journal ajouté');
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )

  }


  // Voir les ecritures d'un journal
  voir_journal(journal_id) {
    this.organisationService.get_journal(journal_id).subscribe(
      (journal: any) => {

        this.selected_journal_id = journal_id;

        this.selectedJournalEcrituresTrier = null;
        this.selectedJournalEcritures = [];
        this.totalDebit = 0;
        this.totalCredit = 0;

        journal.ecritures.forEach(ecriture => {
          ecriture.ecriture_items.forEach(ecritureLine => {
            this.selectedJournalEcritures.push([ecritureLine, ecriture.date_operation, ecriture.libelle_ecriture]);
            this.totalDebit += (parseFloat(ecritureLine['debit']) * parseFloat(ecritureLine['taux']));
            this.totalCredit += (parseFloat(ecritureLine['credit']) * parseFloat(ecritureLine['taux']));

          });
        });

        this.selectedJournalEcrituresTrier = this.selectedJournalEcritures.sort((a, b) =>
          new Date(b[1]).getTime() - new Date(a[1]).getTime()
        );

        console.log(this.selectedJournalEcrituresTrier);

        this.showJournalDetails = true;

      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }


  //Back sur la liste des journaux
  retour_sur_journaux() {
    this.showJournalDetails = false;
  }

  //Get filtre type
  get_filtre_type(event) {
    let filtre_type: any = event.target.value;
    this.journal_filtre_type = filtre_type;

  }

  //Filtre journal
  filtre_journal() {

    this.organisationService.get_journal(this.selected_journal_id).subscribe(
      (journal: any) => {

        this.selectedJournalEcrituresTrier = null;
        this.selectedJournalEcritures = [];
        this.totalDebit = 0;
        this.totalCredit = 0;

        journal.ecritures.forEach(ecriture => {

          // Filtre sur une periode
          if (this.journal_filtre_type == "1") {
            
            if ((new Date(ecriture.date_operation.split('T')[0]).getTime() >= new Date(this.filtreJournalForm.value.filtre_libelle_date_debut).getTime())
              && (new Date(ecriture.date_operation.split('T')[0]).getTime() <= new Date(this.filtreJournalForm.value.filtre_libelle_date_fin).getTime())
            ) {
              ecriture.ecriture_items.forEach(ecritureLine => {
                this.selectedJournalEcritures.push([ecritureLine, ecriture.date_operation, ecriture.libelle_ecriture]);
                this.totalDebit += (parseFloat(ecritureLine['debit']) * parseFloat(ecritureLine['taux']));
                this.totalCredit += (parseFloat(ecritureLine['credit']) * parseFloat(ecritureLine['taux']));
              });
            }
          }

          // Filtre par exercice
          if (this.journal_filtre_type == "2") {

            if (ecriture.exercice.id == this.filtreJournalForm.value.filtre_journal_exercice) {
              ecriture.ecriture_items.forEach(ecritureLine => {
                this.selectedJournalEcritures.push([ecritureLine, ecriture.date_operation, ecriture.libelle_ecriture]);
                this.totalDebit += (parseFloat(ecritureLine['debit']) * parseFloat(ecritureLine['taux']));
                this.totalCredit += (parseFloat(ecritureLine['credit']) * parseFloat(ecritureLine['taux']));
              });
            }
          }


        });

        this.selectedJournalEcrituresTrier = this.selectedJournalEcritures.sort((a, b) =>
          new Date(b[1]).getTime() - new Date(a[1]).getTime()
        );

        this.showRemoveFiltreBtn = true;

      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )

  }

  remove_journal_filtre() {
    this.showRemoveFiltreBtn = false;
    this.voir_journal(this.selected_journal_id);
  }

  //Export details journal Format Excel
  exportExceljournalDetails() {
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(document.getElementById('table_journal'));
    var ws = workbook.Sheets["journal"];
    // save to file
    XLSX.writeFile(workbook, 'journal.xlsx');
  }





}
