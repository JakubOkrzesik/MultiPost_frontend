import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlxAuthCallbackComponent } from './olx-auth-callback.component';

describe('OlxAuthCallbackComponent', () => {
  let component: OlxAuthCallbackComponent;
  let fixture: ComponentFixture<OlxAuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlxAuthCallbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OlxAuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
