/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
