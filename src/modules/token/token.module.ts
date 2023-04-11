/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { BlockchainConnectorModule } from '../blockchain-connector/blockchain-connector.module';
import { ApiConfigService } from '../../settings/apiConfig.service';
import { SegmentAllocationService } from './service/segment-allocation.service';
import { SegmentAllocationController } from './controller/segment-allocation.controller';
import { ConfigModule } from '@nestjs/config';
import { TokenAMQPController } from './controller/token.amqp.controller';
import { SegmentAllocationAMQPController } from './controller/segment-allocation.amqp.controller';

@Module({
  controllers: [TokenController, SegmentAllocationController, TokenAMQPController, SegmentAllocationAMQPController],
  providers: [TokenService, SegmentAllocationService, ApiConfigService],
  imports: [BlockchainConnectorModule, ConfigModule],
})
export class TokenModule {}
