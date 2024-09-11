/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Inject, Injectable } from '@nestjs/common';
import { Interface, JsonRpcProvider, LogDescription, TransactionReceipt, TransactionResponse } from 'ethers';

import { TokenBaseService } from './token-base.services';
import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { TokenReadService } from './token-read.service';
import TokenReadDto from '../dto/token-read.dto';
import TokenUpdateDto from '../dto/token-update.dto';
import { EventService } from './event.service';

@Injectable()
export class TokenUpdateService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly eventService: EventService,
    protected readonly configurationService: ConfigurationService,
    private readonly tokenReadService: TokenReadService,
    @Inject('EthersProvider') protected readonly ethersProvider: JsonRpcProvider,
  ) {
    super(blockchainService, configurationService);
  }

  public async updateToken(tokenId: number, tokenUpdateDto: TokenUpdateDto): Promise<TokenReadDto> {
    try {
      await this.updateTokenOnBlockchain(tokenId, tokenUpdateDto);
      await this.blockchainService.waitForTheNextBlock();
      return this.tokenReadService.getToken(tokenId);
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

  public async confirmChild(tokenId: number, childId: number): Promise<void> {
    try {
      const transactionResponse: TransactionResponse = await this.tokenInstance.confirmChild(tokenId, childId);
      await this.blockchainService.waitForTheNextBlock();

      const transactionReceipt: TransactionReceipt = await this.ethersProvider.getTransactionReceipt(
        transactionResponse.hash,
      );

      const contractInterface = new Interface(this.tokenInstance.interface.fragments);
      const decodedLogs: LogDescription[] = this.eventService.decodeLogs(contractInterface, transactionReceipt, [
        'ChildConfirmed',
      ]);
      this.logger.log(`Parent '${tokenId}' confirmed Child '${childId}' | ${decodedLogs?.[0]?.args}`);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }
}
