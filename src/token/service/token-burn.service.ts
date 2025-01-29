/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@nestjs/common';

import { TokenBaseService } from './token-base.services';
import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class TokenBurnService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
  ) {
    super(blockchainService, configurationService);
  }

  public async burnToken(tokenId: number): Promise<void> {
    try {
      await this.tokenInstance.burn(tokenId);
      await this.blockchainService.waitForTheNextBlock();
      await this.verifyTokenBurn(tokenId);
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  private async verifyTokenBurn(tokenId: number): Promise<void> {
    // Ignore error from smart contract and verify the token was burned
    const ownerAddress: string = await this.tokenInstance.ownerOf(tokenId).catch(() => null);
    if (ownerAddress) {
      throw new Error(`Token with ID '${tokenId}' was not burned successfully.`);
    }
  }
}
