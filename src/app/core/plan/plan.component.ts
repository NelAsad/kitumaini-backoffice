import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})
export class PlanComponent implements OnInit {

  planForm!: FormGroup;
  plan_items = [];

  organisation: any = null;
  user_parsed = null;

  constructor(
    private route: ActivatedRoute,
    private organisationService: OrganisationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    
    const user: any = localStorage.getItem('user_data');
    this.user_parsed = JSON.parse(this.loginService.decryptSTR(user));

    this.planForm = new FormGroup({
      libelle_plan: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      plan_exercice: new FormControl("", [
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


  // Save plan
  save_plan() {
    if (this.planForm.invalid) {
      return;
    }
    if (this.planForm.value.plan_exercice == "") {
      return;
    }
    this.organisationService.save_plan(this.planForm.value, this.plan_items).subscribe(
      (result: any) => {
        this.planForm.reset();
        // this.get_all_journaux();
        window.alert('Plan ajouté');
      },
      (err: any) => {
        console.log(err);
        // if (err.error.statusCode == 401 || err.error.statusCode == 403) {
        // this.alertShow = true;
        // }
      }
    )

  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      this.parseExcel(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
  }

  parseExcel(arrayBuffer: any): void {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(arrayBuffer).then((workbook) => {
      let tabRow: any = [];
      let jsonData: any[] = [];
      workbook.eachSheet((worksheet, sheetId) => {
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          let rowData: any = {};
          let oneLigne: any = [];
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            oneLigne.push(cell.value);
            rowData[`column${colNumber}`] = cell.value;
          });
          tabRow.push(oneLigne);
          jsonData.push(rowData);
        });
      });
      tabRow.shift();
      this.plan_items = tabRow;
      console.log(JSON.stringify(tabRow, null, 2));
    });
  }

}
