import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchCampusDetailComponent } from './church-campus-detail.component';

describe('ChurchCampusDetailComponent', () => {
  let component: ChurchCampusDetailComponent;
  let fixture: ComponentFixture<ChurchCampusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChurchCampusDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchCampusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
