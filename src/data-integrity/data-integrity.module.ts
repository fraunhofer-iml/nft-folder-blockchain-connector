/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { DynamicModule, Module } from '@nestjs/common';

import { DataIntegrityController } from './data-integrity.controller';
import { areEndpointsEnabled } from 'src/shared/utils';
import { DataIntegrityService } from './service/data-integrity.service';

@Module({
  providers: [DataIntegrityService],
  exports: [DataIntegrityService],
})
export class DataIntegrityModule {
  static getDynamicModule(): DynamicModule {
    return {
      module: DataIntegrityModule,
      controllers: areEndpointsEnabled() ? [DataIntegrityController] : [],
    };
  }
}
