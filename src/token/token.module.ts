/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { TokenRestController } from './token.controller';
import { TokenService } from './token.service';
import { EventService } from './event.service';
import { SegmentService } from '../segment/segment.service';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, SharedModule],
  controllers: [TokenRestController],
  providers: [TokenService, EventService, SegmentService],
})
export class TokenModule {}
