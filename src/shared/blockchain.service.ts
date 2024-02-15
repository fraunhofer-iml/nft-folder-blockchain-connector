/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TxSignature } from 'web3/eth/accounts';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';

import { ApiConfigService } from '../config/api.config.service';

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('Web3Service') public readonly web3: any,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.web3.eth.handleRevert = true;
  }

  public async sendTransaction(transactionObject: TransactionObject<any>): Promise<TransactionReceipt> {
    const transactionParameters = this.createTransactionParameters(transactionObject);
    try {
      const signedTransaction: TxSignature = await this.web3.eth.accounts.signTransaction(
        transactionParameters,
        this.apiConfigService.PRIVATE_KEY,
      );
      return await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  private createTransactionParameters(transactionObject: TransactionObject<any>) {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      to: transactionObject._parent._address,
      from: this.web3.eth.accounts.privateKeyToAccount(this.apiConfigService.PRIVATE_KEY).address,
      data: transactionObject.encodeABI(),
      gas: 6721975,
    };
  }

  public async call(transaction: TransactionObject<any>): Promise<any> {
    try {
      return await transaction.call();
    } catch (err) {
      this.handleError(err);
    }
  }

  public derivePublicAddressFromPrivateKey(): any {
    return this.web3.eth.accounts.privateKeyToAccount(this.apiConfigService.PRIVATE_KEY).address;
  }

  public async fetchTransactionTimestamp(transactionHash: string): Promise<number> {
    const transaction = await this.web3.eth.getTransaction(transactionHash);
    if (!transaction || !transaction.blockNumber) {
      throw new BadRequestException('Transaction not found or not yet confirmed.');
    }

    const block = await this.web3.eth.getBlock(transaction.blockNumber);
    if (!block || !block.timestamp) {
      throw new BadRequestException('Block not found or missing timestamp.');
    }

    return block.timestamp;
  }

  public handleError(error: any) {
    let errorMessage = error.data ? error.data.reason : error.reason;
    errorMessage = errorMessage ? errorMessage : error.message;
    throw new BadRequestException(errorMessage);
  }
}
