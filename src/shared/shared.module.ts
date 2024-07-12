/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';
import { EthersProvider } from './ethersProvider';

import { BlockchainService } from './blockchain.service';
import { ApiConfigService } from '../config/api.config.service';

@Module({
  providers: [BlockchainService, EthersProvider, ApiConfigService],
  exports: [BlockchainService, EthersProvider],
})
export class SharedModule {}
