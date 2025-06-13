import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOrganisationUsersComponent } from './one-organisation-users.component';

describe('OneOrganisationUsersComponent', () => {
  let component: OneOrganisationUsersComponent;
  let fixture: ComponentFixture<OneOrganisationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneOrganisationUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneOrganisationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
