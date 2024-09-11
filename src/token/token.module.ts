/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { ConfigurationModule } from 'src/configuration/configuration.module';
import { SharedModule } from '../shared/shared.module';
import { TokenRestController } from './controller/token.controller';
import { TokenBaseService } from './service/token-base.services';
import { TokenCreateService } from './service/token-create.service';
import { TokenReadService } from './service/token-read.service';
import { TokenUpdateService } from './service/token-update.service';
import { TokenDeleteService } from './service/token-delete.service';
import { SegmentService } from '../segment/segment.service';
import { EventService } from './service/event.service';

@Module({
  imports: [ConfigurationModule, SharedModule],
  controllers: [TokenRestController],
  providers: [
    TokenBaseService,
    TokenCreateService,
    TokenReadService,
    TokenUpdateService,
    TokenDeleteService,
    EventService,
    SegmentService,
  ],
})
export class TokenModule {}
