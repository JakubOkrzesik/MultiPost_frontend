import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllegroAuthCallbackComponent } from './allegro-auth-callback.component';

describe('AllegroAuthCallbackComponent', () => {
  let component: AllegroAuthCallbackComponent;
  let fixture: ComponentFixture<AllegroAuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllegroAuthCallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllegroAuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
