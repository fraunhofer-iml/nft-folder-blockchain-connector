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
