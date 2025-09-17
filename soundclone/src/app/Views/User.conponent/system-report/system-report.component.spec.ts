import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemReportComponent } from './system-report.component';

describe('SystemReportComponent', () => {
  let component: SystemReportComponent;
  let fixture: ComponentFixture<SystemReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
