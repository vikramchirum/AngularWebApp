import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferServiceInfoComponent } from './transfer-service-info.component';

describe('TransferServiceInfoComponent', () => {
  let component: TransferServiceInfoComponent;
  let fixture: ComponentFixture<TransferServiceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferServiceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferServiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
