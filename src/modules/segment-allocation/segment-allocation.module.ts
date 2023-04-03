import { Module } from '@nestjs/common';
import { SegmentAllocationController } from './controller/segment-allocation.controller';

@Module({
  controllers: [SegmentAllocationController]
})
export class SegmentAllocationModule {}
