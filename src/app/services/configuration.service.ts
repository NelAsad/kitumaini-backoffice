import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../configs/api.config';
import { Observable } from 'rxjs';

export interface organisationForm {
  organisation_nom: string;
}

export interface siteForm {
  site_nom: string;
  site_organisation: string;
}

export interface journalForm {
  libelle_journal: string;
  journal_organisation: string;
}

export interface planForm {
  libelle_plan: string;
  plan_exercice: string;
}

export interface exerciceForm {
  libelle_exercice: string;
  date_debut_exercice: string;
  date_fin_exercice: string;
  exercice_devise_de_base: string;
  exercice_organisation: string;
}

export interface tauxForm {
  date_taux: string;
  devise_taux: string;
  taux_fontionnel: string;
  taux_presentation: string;
  taux_historique: string;
  taux_exercice: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private readonly urlPath = ApiConfig.url;

  constructor(
    private http: HttpClient,
  ) { }

  //Get all organisation
  get_all_organisation() {
    return this.http.get(this.urlPath + 'api/organisation/get/all').pipe()
  }

  //Get all sites
  get_all_sites() {
    return this.http.get(this.urlPath + 'api/site/get/all').pipe()
  }

  //Get all exercices
  get_all_exercices() {
    return this.http.get(this.urlPath + 'api/exercice/get/all').pipe()
  }

  //Get all journaux
  get_all_journaux() {
    return this.http.get(this.urlPath + 'api/journal/get/all').pipe()
  }

  //Get all journaux
  get_journal(journal_id) {
    return this.http.get(this.urlPath + 'api/journal/get/' + journal_id).pipe()
  }

  //Get grand livre data
  get_grandivre_data(exercice_id: number) {
    return this.http.get(this.urlPath + 'api/grandlivre/get/all_for_exercice/' + exercice_id).pipe()
  }

  //Save organisation
  save_organisation(organisation: organisationForm, ) {
    return this.http.post(this.urlPath + 'api/organisation/' + 1,
      {
        libelle_organisation: organisation.organisation_nom.trim(),
      },
    ).pipe()
  }

  //Save Site
  save_site(site: siteForm) {
    return this.http.post(this.urlPath + 'api/site/',
      {
        libelle_site: site.site_nom.trim(),
        organisation_id: site.site_organisation.trim(),
      },
    ).pipe()
  }

  //Save journal
  save_journal(journal: journalForm) {
    return this.http.post(this.urlPath + 'api/journal/',
      {
        libelle_journal: journal.libelle_journal.trim(),
        organisation_id: journal.journal_organisation.trim(),
      },
    ).pipe()
  }

  //Save Exercice
  save_exercice(exercice: exerciceForm) {
    return this.http.post(this.urlPath + 'api/exercice/',
      {
        libelle_exercice: exercice.libelle_exercice.trim(),
        date_debut_exercice: exercice.date_debut_exercice.trim(),
        date_fin_exercice: exercice.date_fin_exercice.trim(),
        devise_de_base: exercice.exercice_devise_de_base.trim(),
        organisation_id: exercice.exercice_organisation.trim(),
      },
    ).pipe()
  }

  //Save Plan
  save_plan(plan: planForm, plan_items: any) {
    return this.http.post(this.urlPath + 'api/plan/',
      {
        libelle_plan: plan.libelle_plan.trim(),
        exercice_id: plan.plan_exercice.trim(),
        items: plan_items
      },
    ).pipe()
  }

  //Save Taux du jour
  set_taux_du_jour(taux: tauxForm) {
    return this.http.post(this.urlPath + 'api/taux/',
      {
        date_taux: taux.date_taux.trim(),
        devise_taux: taux.devise_taux.trim(),
        taux_fontionnel: taux.taux_fontionnel.trim(),
        taux_presentation: taux.taux_presentation.trim(),
        taux_historique: taux.taux_historique.trim(),
        exercice: taux.taux_exercice.trim(),
      },
    ).pipe()
  }


  //check if taux exist pour une date
  get_check_taux_exist_for_date(date_taux: string, devise_taux: string, taux_exercice: string) {

    return this.http.post(this.urlPath + 'api/taux/get_check_taux_exist_for_date',
      {
        date_taux: date_taux.trim(),
        taux_exercice: taux_exercice.toString().trim(),
        devise_taux: devise_taux.trim(),
      },
    ).pipe()

  }

  //check if taux exist pour une date
  save_ecritures(form_ecriture: any, tableaux_ecritures: any, devise_de_base: any, user_id:any, site_id: any) {

    return this.http.post(this.urlPath + 'api/ecritures/save_ecritures',
      {
        ecriture_journal: form_ecriture.ecriture_journal,
        ecriture_exercice: form_ecriture.ecriture_exercice,
        ecriture_date_operation: form_ecriture.ecriture_date_operation,
        ecriture_libelle: form_ecriture.ecriture_libelle,
        devise_de_base: devise_de_base,
        tableaux_ecritures: tableaux_ecritures,
        user_id: user_id,
        site_id: site_id,
      },
    ).pipe()

  }



}
