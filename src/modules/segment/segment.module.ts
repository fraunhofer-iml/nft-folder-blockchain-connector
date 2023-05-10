/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';

import { SegmentRestController } from './controller/rest/segment.rest.controller';
import { SegmentAmqpController } from './controller/amqp/segment.amqp.controller';

import { SegmentService } from './service/segment.service';
import { ApiConfigService } from '../../config/apiConfig.service';

import { BlockchainConnectorModule } from '../blockchain-connector/blockchain-connector.module';

@Module({
  controllers: [SegmentRestController, SegmentAmqpController],
  providers: [SegmentService, ApiConfigService],
  imports: [BlockchainConnectorModule],
})
export class SegmentModule {}
