import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperlessSettingsComponent } from './paperless-settings.component';

describe('PaperlessSettingsComponent', () => {
  let component: PaperlessSettingsComponent;
  let fixture: ComponentFixture<PaperlessSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperlessSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperlessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
