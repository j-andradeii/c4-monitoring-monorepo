import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchCampusDashboardComponent } from './church-campus-dashboard.component';

describe('ChurchCampusDashboardComponent', () => {
  let component: ChurchCampusDashboardComponent;
  let fixture: ComponentFixture<ChurchCampusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChurchCampusDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchCampusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
