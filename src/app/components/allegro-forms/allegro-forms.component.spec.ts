import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllegroFormsComponent } from './allegro-forms.component';

describe('AllegroFormsComponent', () => {
  let component: AllegroFormsComponent;
  let fixture: ComponentFixture<AllegroFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllegroFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllegroFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
