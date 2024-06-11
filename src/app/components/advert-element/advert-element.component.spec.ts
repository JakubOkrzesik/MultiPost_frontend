import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertElementComponent } from './advert-element.component';

describe('AdvertElementComponent', () => {
  let component: AdvertElementComponent;
  let fixture: ComponentFixture<AdvertElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvertElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
