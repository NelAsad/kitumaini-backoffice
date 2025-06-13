import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss'
})
export class SitesComponent implements OnInit  {

  siteForm!: FormGroup;
  organisations = []
  sites = []

  constructor(
    private configurationService: ConfigurationService,
  ) { }

  ngOnInit(): void {

    this.get_all_organisation();
    this.get_all_sites();

    this.siteForm = new FormGroup({
      site_nom: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      site_organisation: new FormControl("", [
        Validators.required,
      ]),
    });
  }

  //Get all organisation without pagination
  get_all_organisation() {
    this.configurationService.get_all_organisation().subscribe(
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

  //Get all sites without pagination
  get_all_sites() {
    this.configurationService.get_all_sites().subscribe(
      (sites: any) => {
        console.log(sites);
        
        this.sites = sites;
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
  save_site(){
    if (this.siteForm.invalid) {
      return;
    }
    if (this.siteForm.value.site_organisation == "") {
      return;
    }
    this.configurationService.save_site(this.siteForm.value).subscribe(
      (result: any) => {
        this.siteForm.reset();
        this.get_all_sites();
        window.alert('Site ajouté');
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
          // this.alertShow = true;
        // }
      }
    )
  }

  //Explorer site
  explorer_site(site_id){
    console.log(site_id);
    
  }

}
