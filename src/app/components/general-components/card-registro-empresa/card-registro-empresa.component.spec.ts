import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRegistroEmpresaComponent } from './card-registro-empresa.component';

describe('CardRegistroEmpresaComponent', () => {
  let component: CardRegistroEmpresaComponent;
  let fixture: ComponentFixture<CardRegistroEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardRegistroEmpresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRegistroEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
