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
import { ApiConfigService } from '../config/api.config.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TokenRestController],
  providers: [TokenService, EventService, SegmentService, ApiConfigService],
})
export class TokenModule {}
