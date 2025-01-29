/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
