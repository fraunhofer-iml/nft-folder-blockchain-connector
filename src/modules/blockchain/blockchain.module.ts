/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

import { BlockchainService } from './service/blockchain.service';
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
  providers: [BlockchainService, Web3Service, ApiConfigService],
  exports: [BlockchainService, Web3Service],
})
export class BlockchainModule {}
