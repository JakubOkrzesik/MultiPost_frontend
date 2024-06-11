import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceChangeDialogComponent } from './price-change-dialog.component';

describe('PriceChangeDialogComponent', () => {
  let component: PriceChangeDialogComponent;
  let fixture: ComponentFixture<PriceChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceChangeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
