import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdvertsListComponent } from './user-adverts-list.component';

describe('UserAdvertsListComponent', () => {
  let component: UserAdvertsListComponent;
  let fixture: ComponentFixture<UserAdvertsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAdvertsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAdvertsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
