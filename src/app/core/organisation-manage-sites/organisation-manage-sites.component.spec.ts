import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationManageSitesComponent } from './organisation-manage-sites.component';

describe('OrganisationManageSitesComponent', () => {
  let component: OrganisationManageSitesComponent;
  let fixture: ComponentFixture<OrganisationManageSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationManageSitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationManageSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
