import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPagesPortalComponent } from './public-pages-portal.component';

describe('PublicPagesPortalComponent', () => {
  let component: PublicPagesPortalComponent;
  let fixture: ComponentFixture<PublicPagesPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicPagesPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPagesPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
