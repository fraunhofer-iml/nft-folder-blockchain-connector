/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { SegmentController } from './segment.controller';
import { SegmentService } from './segment.service';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, SharedModule],
  controllers: [SegmentController],
  providers: [SegmentService],
})
export class SegmentModule {}
