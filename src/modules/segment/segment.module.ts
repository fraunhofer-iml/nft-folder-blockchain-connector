/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { SegmentRestController } from './controller/rest/segment.rest.controller';
import { SegmentAmqpController } from './controller/amqp/segment.amqp.controller';

import { SegmentService } from './service/segment.service';
import { ApiConfigService } from '../../config/apiConfig.service';

import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  controllers: [SegmentRestController, SegmentAmqpController],
  providers: [SegmentService, ApiConfigService],
  imports: [BlockchainModule],
})
export class SegmentModule {}
