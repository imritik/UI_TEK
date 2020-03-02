import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassConfirmPassComponent } from './forgot-pass-confirm-pass.component';

describe('ForgotPassConfirmPassComponent', () => {
  let component: ForgotPassConfirmPassComponent;
  let fixture: ComponentFixture<ForgotPassConfirmPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPassConfirmPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPassConfirmPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
