import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangeAdminComponent } from './password-change-admin.component';

describe('PasswordChangeAdminComponent', () => {
  let component: PasswordChangeAdminComponent;
  let fixture: ComponentFixture<PasswordChangeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordChangeAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordChangeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
