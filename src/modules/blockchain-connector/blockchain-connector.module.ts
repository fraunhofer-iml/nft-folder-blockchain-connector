/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

import { BlockchainConnectorService } from './blockchain-connector.service';
import { ApiConfigService } from '../../config/apiConfig.service';

const Web3Service = {
  provide: 'Web3Service',
  useFactory: async (apiConfigService: ConfigService) => {
    const web3 = new Web3(apiConfigService.get<string>('BLOCKCHAIN_URL'));
    web3.eth.handleRevert = true;
    return web3;
  },
  inject: [ConfigService],
};

@Module({
  providers: [BlockchainConnectorService, Web3Service, ApiConfigService],
  exports: [BlockchainConnectorService, Web3Service],
})
export class BlockchainConnectorModule {}
