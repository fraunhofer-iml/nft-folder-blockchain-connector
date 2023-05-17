/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { TokenRestController } from './controller/rest/token.rest.controller';
import { TokenAmqpController } from './controller/amqp/tokenAmqpController';

import { TokenService } from './service/token.service';
import { ApiConfigService } from '../../config/apiConfig.service';

import { BlockchainModule } from '../blockchain/blockchain.module';
import { SegmentService } from '../segment/service/segment.service';

@Module({
  controllers: [TokenRestController, TokenAmqpController],
  providers: [TokenService, SegmentService, ApiConfigService],
  imports: [BlockchainModule],
})
export class TokenModule {}
