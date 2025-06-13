import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-organisation-manage-sites',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './organisation-manage-sites.component.html',
  styleUrl: './organisation-manage-sites.component.scss'
})
export class OrganisationManageSitesComponent implements OnInit {

  siteForm!: FormGroup;

  organisation: any = null;
  sites = [];

  user_parsed = null;

  constructor(
      private route: ActivatedRoute,
      private organisationService: OrganisationService,
      private loginService: LoginService,
    ) { }

  ngOnInit(): void {
    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.siteForm = new FormGroup({
      site_nom: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      site_organisation: new FormControl(null, [
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


  // Save organisation
  save_site() {
    this.siteForm.get('site_organisation').setValue(String(this.user_parsed.organisation.id));

    if (this.siteForm.invalid) {
      return;
    }
    if (this.siteForm.value.site_organisation == "") {
      return;
    }

    this.organisationService.save_site(this.siteForm.value).subscribe(
      (result: any) => {
        this.siteForm.reset();
        this.get_one_organisation();
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

  // Explorer site
  explorer_site(site_id: string) {
    console.log(site_id);

  }



}
