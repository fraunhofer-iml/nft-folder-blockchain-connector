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
import { TokenRestController } from './token.controller';
import { TokenBaseService } from './token-base.services';
import { TokenCreateService } from './token-create.service';
import { TokenReadService } from './token-read.service';
import { TokenUpdateService } from './token-update.service';
import { TokenDeleteService } from './token-delete.service';
import { SegmentService } from '../segment/segment.service';
import { EventService } from './event.service';

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
