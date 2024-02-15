/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { BlockchainService } from './blockchain.service';
import { Web3Service } from './web3.service';
import { ApiConfigService } from '../config/api.config.service';

@Module({
  providers: [BlockchainService, Web3Service, ApiConfigService],
  exports: [BlockchainService, Web3Service],
})
export class SharedModule {}
