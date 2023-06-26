/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { TokenRestController } from './controller/token.controller';

import { TokenService } from './service/token.service';
import { EventInformationService } from './service/eventInformation.service';
import { SegmentService } from '../segment/service/segment.service';
import { ApiConfigService } from '../../config/apiConfig.service';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  controllers: [TokenRestController],
  providers: [TokenService, EventInformationService, SegmentService, ApiConfigService],
  imports: [BlockchainModule],
})
export class TokenModule {}
