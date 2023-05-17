/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SegmentModule } from './modules/segment/segment.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    SegmentModule,
    TokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
