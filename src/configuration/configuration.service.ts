/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import {
  BLOCKCHAIN_CONFIGURATION_IDENTIFIER,
  BlockchainConfiguration,
} from './configurations/blockchain.configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  public getBlockchainConfiguration(): BlockchainConfiguration | undefined {
    return this.configService.get<BlockchainConfiguration>(BLOCKCHAIN_CONFIGURATION_IDENTIFIER);
  }
}
