/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';

import { SegmentAllocationRestController } from './controller/rest/segment-allocation.rest.controller';
import { SegmentAllocationAmqpController } from './controller/amqp/segment-allocation.amqp.controller';
import { TokenRestController } from './controller/rest/token.rest.controller';
import { TokenAmqpController } from './controller/amqp/tokenAmqpController';

import { TokenService } from './service/token.service';
import { SegmentAllocationService } from './service/segment-allocation.service';
import { ApiConfigService } from '../../config/apiConfig.service';

import { BlockchainConnectorModule } from '../blockchain-connector/blockchain-connector.module';

@Module({
  controllers: [
    SegmentAllocationRestController,
    SegmentAllocationAmqpController,
    TokenRestController,
    TokenAmqpController,
  ],
  providers: [TokenService, SegmentAllocationService, ApiConfigService],
  imports: [BlockchainConnectorModule],
})
export class TokenModule {}

// TODO-MP: extract all extension related token code into their own corresponding files
