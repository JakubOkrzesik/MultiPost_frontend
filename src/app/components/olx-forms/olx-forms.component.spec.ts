import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlxFormsComponent } from './olx-forms.component';

describe('OlxFormsComponent', () => {
  let component: OlxFormsComponent;
  let fixture: ComponentFixture<OlxFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlxFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OlxFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
