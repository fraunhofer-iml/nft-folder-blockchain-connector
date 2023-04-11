/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';
import { SegmentController } from './controller/segment.controller';
import { SegmentService } from './service/segment.service';
import { BlockchainConnectorModule } from '../blockchain-connector/blockchain-connector.module';
import { ApiConfigService } from '../../settings/apiConfig.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SegmentController],
  providers: [SegmentService, ApiConfigService],
  imports: [BlockchainConnectorModule, ConfigModule],
})
export class SegmentModule {}
