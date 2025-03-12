import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlaySidebarComponent } from './overlay-sidebar.component';

describe('OverlaySidebarComponent', () => {
  let component: OverlaySidebarComponent;
  let fixture: ComponentFixture<OverlaySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverlaySidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlaySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
