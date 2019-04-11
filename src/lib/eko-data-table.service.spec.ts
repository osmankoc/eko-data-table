import { TestBed } from '@angular/core/testing';

import { EkoDataTableService } from './eko-data-table.service';

describe('EkoDataTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EkoDataTableService = TestBed.get(EkoDataTableService);
    expect(service).toBeTruthy();
  });
});
