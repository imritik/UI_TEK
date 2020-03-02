import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordFirstTimeLoginComponent } from './reset-password-first-time-login.component';

describe('ResetPasswordFirstTimeLoginComponent', () => {
  let component: ResetPasswordFirstTimeLoginComponent;
  let fixture: ComponentFixture<ResetPasswordFirstTimeLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordFirstTimeLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordFirstTimeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
