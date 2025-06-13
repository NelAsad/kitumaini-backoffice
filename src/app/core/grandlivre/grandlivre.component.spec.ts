import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandlivreComponent } from './grandlivre.component';

describe('GrandlivreComponent', () => {
  let component: GrandlivreComponent;
  let fixture: ComponentFixture<GrandlivreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandlivreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrandlivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
