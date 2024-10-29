import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmpresaSkeletonComponent } from './card-empresa-skeleton.component';

describe('CardEmpresaSkeletonComponent', () => {
  let component: CardEmpresaSkeletonComponent;
  let fixture: ComponentFixture<CardEmpresaSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardEmpresaSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmpresaSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
