/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';

import { SegmentModule } from './segment/segment.module';
import { TokenModule } from './token/token.module';
import { DataIntegrityModule } from './data-integrity/data-integrity.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    SegmentModule.getDynamicModule(),
    TokenModule.getDynamicModule(),
    DataIntegrityModule.getDynamicModule(),
    ConfigurationModule,
  ],
})
export class AppModule {}
