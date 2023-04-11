/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SegmentAllocationController } from './segment-allocation.controller';

describe('SegmentAllocationController', () => {
  let controller: SegmentAllocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SegmentAllocationController],
    }).compile();

    controller = module.get<SegmentAllocationController>(SegmentAllocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
