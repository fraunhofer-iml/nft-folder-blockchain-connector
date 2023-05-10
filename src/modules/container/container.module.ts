/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';

import { ContainerRestController } from './controller/rest/container.rest.controller';
import { ContainerAmqpController } from './controller/amqp/container.amqp.controller';

import { ContainerService } from './service/container.service';
import { ApiConfigService } from '../../config/apiConfig.service';

import { BlockchainConnectorModule } from '../blockchain-connector/blockchain-connector.module';

@Module({
  controllers: [ContainerRestController, ContainerAmqpController],
  providers: [ContainerService, ApiConfigService],
  imports: [BlockchainConnectorModule],
})
export class ContainerModule {}
