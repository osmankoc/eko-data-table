import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EkoDataTableComponent } from './eko-data-table.component';

describe('EkoDataTableComponent', () => {
  let component: EkoDataTableComponent;
  let fixture: ComponentFixture<EkoDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EkoDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EkoDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
