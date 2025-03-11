import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GwcToastComponent } from './gwc-toast.component';

describe('GwcToastComponent', () => {
  let component: GwcToastComponent;
  let fixture: ComponentFixture<GwcToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GwcToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GwcToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
