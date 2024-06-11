import { TestBed } from '@angular/core/testing';

import { AllegroService } from './allegro.service';

describe('AllegroService', () => {
  let service: AllegroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllegroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
