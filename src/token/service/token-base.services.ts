/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable, Logger } from '@nestjs/common';
import { Contract } from 'ethers';

import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export abstract class TokenBaseService {
  protected readonly logger = new Logger(BlockchainService.name);
  protected tokenInstance: Contract;

  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
  ) {
    this.initializeTokenInstance();
  }

  private initializeTokenInstance(): void {
    const { tokenAddress, tokenAbi } = this.configurationService.getBlockchainConfiguration();
    this.tokenInstance = this.blockchainService.getContractInstance(tokenAddress, tokenAbi);
  }

  protected handleError(err: any): void {
    try {
      const targetAddress = this.tokenInstance?.target?.toString() || 'Unknown';
      this.blockchainService.handleError(err, targetAddress);
    } catch (handledError) {
      this.logger.error(handledError);
      throw handledError;
    }
  }
}
