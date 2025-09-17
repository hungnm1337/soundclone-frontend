import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrackComponent } from './create-track.component';

describe('CreateTrackComponent', () => {
  let component: CreateTrackComponent;
  let fixture: ComponentFixture<CreateTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
