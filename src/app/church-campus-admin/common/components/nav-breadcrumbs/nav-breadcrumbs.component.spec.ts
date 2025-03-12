import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBreadcrumbsComponent } from './nav-breadcrumbs.component';

describe('NavBreadcrumbsComponent', () => {
  let component: NavBreadcrumbsComponent;
  let fixture: ComponentFixture<NavBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBreadcrumbsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
