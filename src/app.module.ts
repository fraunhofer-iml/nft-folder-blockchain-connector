/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ContainerModule } from './modules/container/container.module';
import { SegmentModule } from './modules/segment/segment.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    ContainerModule,
    SegmentModule,
    TokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
