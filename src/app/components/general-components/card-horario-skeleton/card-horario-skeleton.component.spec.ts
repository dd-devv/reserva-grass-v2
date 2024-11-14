import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHorarioSkeletonComponent } from './card-horario-skeleton.component';

describe('CardHorarioSkeletonComponent', () => {
  let component: CardHorarioSkeletonComponent;
  let fixture: ComponentFixture<CardHorarioSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardHorarioSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHorarioSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
