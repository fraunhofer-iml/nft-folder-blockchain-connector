/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { SegmentModule } from './segment/segment.module';
import { TokenModule } from './token/token.module';
import { DataIntegrityModule } from './data-integrity/data-integrity.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [SegmentModule, TokenModule, DataIntegrityModule, ConfigurationModule],
})
export class AppModule {}
