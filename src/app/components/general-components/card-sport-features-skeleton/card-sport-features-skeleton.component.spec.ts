import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSportFeaturesSkeletonComponent } from './card-sport-features-skeleton.component';

describe('CardSportFeaturesSkeletonComponent', () => {
  let component: CardSportFeaturesSkeletonComponent;
  let fixture: ComponentFixture<CardSportFeaturesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardSportFeaturesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSportFeaturesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
