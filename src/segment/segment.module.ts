/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { DynamicModule, Module } from '@nestjs/common';

import { SegmentController } from './segment.controller';
import { SegmentService } from './segment.service';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { areEndpointsEnabled } from 'src/shared/utils';

@Module({
  imports: [ConfigurationModule, SharedModule],
  providers: [SegmentService],
  exports: [SegmentService],
})
export class SegmentModule {
  static getDynamicModule(): DynamicModule {
    return {
      module: SegmentModule,
      controllers: areEndpointsEnabled() ? [SegmentController] : [],
    };
  }
}
