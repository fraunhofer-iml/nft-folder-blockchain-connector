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
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule],
  providers: [BlockchainService, EthersProvider],
  exports: [BlockchainService, EthersProvider],
})
export class SharedModule {}
