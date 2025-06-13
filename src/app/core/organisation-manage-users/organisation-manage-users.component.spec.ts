import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationManageUsersComponent } from './organisation-manage-users.component';

describe('OrganisationManageUsersComponent', () => {
  let component: OrganisationManageUsersComponent;
  let fixture: ComponentFixture<OrganisationManageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationManageUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
