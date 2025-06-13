import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOrganisationComponent } from './one-organisation.component';

describe('OneOrganisationComponent', () => {
  let component: OneOrganisationComponent;
  let fixture: ComponentFixture<OneOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneOrganisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
