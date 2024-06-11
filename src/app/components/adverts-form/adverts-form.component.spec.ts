import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertsFormComponent } from './adverts-form.component';

describe('AdvertsFormComponent', () => {
  let component: AdvertsFormComponent;
  let fixture: ComponentFixture<AdvertsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvertsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
