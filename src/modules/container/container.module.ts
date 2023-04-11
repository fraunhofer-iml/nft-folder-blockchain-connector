/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';
import { ContainerController } from './controller/container.controller';
import { BlockchainConnectorModule } from '../blockchain-connector/blockchain-connector.module';
import { ContainerService } from './service/container.service';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from '../../settings/apiConfig.service';

@Module({
  controllers: [ContainerController],
  providers: [ContainerService, ApiConfigService],
  imports: [BlockchainConnectorModule, ConfigModule],
})
export class ContainerModule {}
