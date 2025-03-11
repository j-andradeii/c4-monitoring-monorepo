import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchCampusAdminPortalComponent } from './church-campus-admin-portal.component';

describe('ChurchCampusAdminPortalComponent', () => {
  let component: ChurchCampusAdminPortalComponent;
  let fixture: ComponentFixture<ChurchCampusAdminPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChurchCampusAdminPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchCampusAdminPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
