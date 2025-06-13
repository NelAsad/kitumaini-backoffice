import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-one-organisation',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './one-organisation.component.html',
  styleUrl: './one-organisation.component.scss'
})
export class OneOrganisationComponent implements OnInit {

  organisationId: string | null = null;
  organisation: any = null;
  siteForm!: FormGroup;

  user_parsed = null;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    // Récupérer le paramètre de la route
    this.organisationId = this.route.snapshot.paramMap.get('id');
    // Si vous voulez écouter les changements dynamiques de paramètre : (Une alternative à la première)
    // this.route.paramMap.subscribe(params => {
    //   this.organisationId = params.get('id');
    // });

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

    this.organisationService.get_one_organisation(this.organisationId).subscribe(
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


  manage_users(){
    this.router.navigate(['organisation/users/'+this.organisationId]);
  }


  // Save organisation
  save_site(){
    this.siteForm.get('site_organisation').setValue(this.organisationId);

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
