import { Module } from '@nestjs/common';
import { SegmentController } from './segment.controller';

@Module({
  controllers: [SegmentController]
})
export class SegmentModule {}
