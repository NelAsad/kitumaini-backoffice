import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule, FormsModule],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './demandes.component.html',
  styleUrl: './demandes.component.scss'
})
export class DemandesComponent implements OnInit {

  demandes = [];
  groupes = [];
  selectedDemandeId: number | null = null;
  selectedDemande: any = null;

  ApprobationGroupe: any = 0;
  AdminComment: string = "";

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { 
    // customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    this.get_all_demandes();
    this.get_all_groupes();
  }


  //open modal show one demande
  open_modal_show_demande(content, demandeId: number) {
    this.selectedDemandeId = demandeId;
    this.selectedDemande = this.demandes.find((d: any) => d.id === demandeId) || null;
    console.log(this.selectedDemande);
		this.modalService.open(content, { size: 'lg' });
	}

  //open modal approuver
  open_modal_approuver(content, demandeId: number) {
    this.selectedDemandeId = demandeId;
    this.selectedDemande = this.demandes.find((d: any) => d.id === demandeId) || null;
    console.log(this.selectedDemande);
		this.modalService.open(content, { size: 'lg' });
	}

  //Action approuver la condidature
  valider_candidature(){
    this.modalService.dismissAll(); // Fermer le modal après succès
    this.organisationService.valider_candidature(this.selectedDemandeId,).subscribe(
      (result: any) => {
        console.log(result);
        alert('Candidature approuvée avec succès.');
      },
      (err: any) => { 
        alert(err.error.message || 'Une erreur est survenue lors de l\'approbation de la candidature.');
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }

  //Action rejeter la condidature
  rejeter_candidature(){
    this.modalService.dismissAll(); // Fermer le modal après succès
    this.organisationService.rejeter_candidature(this.selectedDemandeId, this.AdminComment).subscribe(
      (result: any) => {
        console.log(result);
        alert('Candidature rejetée avec succès.');
      },
      (err: any) => {
        alert(err.error.message || 'Une erreur est survenue lors du rejet de la candidature.');
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }

  //open modal approuver
  open_modal_rejeter(content, demandeId: number) {
    this.selectedDemandeId = demandeId;
    this.selectedDemande = this.demandes.find((d: any) => d.id === demandeId) || null;
    console.log(this.selectedDemande);
		this.modalService.open(content, { size: 'lg' });
	}


  //get all demandes
  get_all_demandes() {
    this.organisationService.get_all_demandes().subscribe(
      (demandes: any) => {
        this.demandes = demandes;
        console.log(demandes);
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )
  }

  //get all groupes
  get_all_groupes() {
    this.organisationService.get_all_groupes().subscribe(
      (groupes: any) => {
        this.groupes = groupes;
        console.log(groupes);
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



