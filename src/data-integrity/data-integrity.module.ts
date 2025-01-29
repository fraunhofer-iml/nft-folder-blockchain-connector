/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
