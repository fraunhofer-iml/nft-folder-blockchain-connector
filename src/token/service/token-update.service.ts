/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inject, Injectable } from '@nestjs/common';
import { Interface, JsonRpcProvider, LogDescription, TransactionReceipt, TransactionResponse } from 'ethers';

import { TokenBaseService } from './token-base.services';
import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { TokenReadService } from './token-read.service';
import { TokenReadDto } from '../dto/token-read.dto';
import { TokenUpdateDto } from '../dto/token-update.dto';
import { EventService } from './event.service';

@Injectable()
export class TokenUpdateService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
    protected readonly eventService: EventService,
    private readonly tokenReadService: TokenReadService,
    @Inject('EthersProvider') protected readonly ethersProvider: JsonRpcProvider,
  ) {
    super(blockchainService, configurationService);
  }

  public async transferToken(tokenId: number, receiverAddress: string): Promise<TokenReadDto> {
    const ownAddress: string = this.blockchainService.returnSignerAddress();
    try {
      await this.tokenInstance.safeTransferFrom(ownAddress, receiverAddress, tokenId);
      await this.blockchainService.waitForTheNextBlock();
      return this.tokenReadService.getToken(tokenId);
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  public async updateToken(tokenId: number, tokenUpdateDto: TokenUpdateDto): Promise<TokenReadDto> {
    try {
      await this.tokenInstance.updateToken(
        tokenId,
        this.getValue(tokenUpdateDto.assetUri),
        this.getValue(tokenUpdateDto.assetHash),
        this.getValue(tokenUpdateDto.metadataUri),
        this.getValue(tokenUpdateDto.metadataHash),
        this.getValue(tokenUpdateDto.additionalData),
      );

      await this.blockchainService.waitForTheNextBlock();

      return this.tokenReadService.getToken(tokenId);
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
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
        'ChildOfParentConfirmed',
      ]);
      this.logger.log(
        `### Child confirmed ###
        TxId: ${transactionReceipt.hash}
        Parent '${tokenId}' confirmed Child '${childId}'
        ChildOfParentConfirmed: ${decodedLogs?.[0]?.args}`,
      );
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }
}
