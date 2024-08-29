/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';

import { TokenBaseService } from './token-base.services';
import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { TokenReadService } from './token-read.service';
import TokenReadDto from './dto/token-read.dto';
import TokenUpdateDto from './dto/token-update.dto';

@Injectable()
export class TokenUpdateService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
    private readonly tokenReadService: TokenReadService,
  ) {
    super(blockchainService, configurationService);
  }

  public async updateTokenByTokenId(tokenId: number, tokenUpdateDto: TokenUpdateDto): Promise<TokenReadDto> {
    try {
      await this.updateTokenOnBlockchain(tokenId, tokenUpdateDto);
      await this.blockchainService.waitForTheNextBlock();
      return this.tokenReadService.getTokenByTokenId(tokenId);
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  private async updateTokenOnBlockchain(tokenId: number, tokenUpdateDto: TokenUpdateDto): Promise<void> {
    await this.tokenInstance.updateToken(
      tokenId,
      this.getValue(tokenUpdateDto.assetUri),
      this.getValue(tokenUpdateDto.assetHash),
      this.getValue(tokenUpdateDto.metadataUri),
      this.getValue(tokenUpdateDto.metadataHash),
      this.getValue(tokenUpdateDto.additionalInformation),
    );
  }

  private getValue(field: string): string {
    return field || '';
  }
}
