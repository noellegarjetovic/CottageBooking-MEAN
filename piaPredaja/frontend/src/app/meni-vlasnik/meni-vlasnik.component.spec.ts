import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniVlasnikComponent } from './meni-vlasnik.component';

describe('MeniVlasnikComponent', () => {
  let component: MeniVlasnikComponent;
  let fixture: ComponentFixture<MeniVlasnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeniVlasnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeniVlasnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
