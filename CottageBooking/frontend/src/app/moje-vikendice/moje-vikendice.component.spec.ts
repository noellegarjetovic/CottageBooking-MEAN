import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojeVikendiceComponent } from './moje-vikendice.component';

describe('MojeVikendiceComponent', () => {
  let component: MojeVikendiceComponent;
  let fixture: ComponentFixture<MojeVikendiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojeVikendiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojeVikendiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
