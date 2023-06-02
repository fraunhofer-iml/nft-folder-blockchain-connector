/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { catchError, defer, from, map, Observable, of, switchMap } from 'rxjs';
import TransactionReceipt from 'web3/types';
import { TxSignature } from 'web3/eth/accounts';
import { TransactionObject } from 'web3/eth/types';

import { ApiConfigService } from '../../../config/apiConfig.service';

@Injectable()
export class BlockchainService {
  constructor(@Inject('Web3Service') public readonly web3: any, private readonly apiConfigService: ApiConfigService) {
    this.web3.eth.handleRevert = true;
  }

  public sendBatchTransactions(transactionObjects: TransactionObject<any>[]): Observable<true> {
    const batch = new this.web3.eth.BatchRequest();

    transactionObjects.forEach((transactionObject) => {
      const transactionParameters = this.createTransactionParameters(transactionObject);
      batch.add(this.web3.eth.sendTransaction.request(transactionParameters));
    });

    return defer(() => {
      batch.execute();
      return of(true);
    }).pipe(catchError(this.handleError));
  }

  public sendTransaction(transactionObject: TransactionObject<any>): Observable<TransactionReceipt> {
    const transactionParameters = this.createTransactionParameters(transactionObject);

    return defer(() =>
      from(this.web3.eth.accounts.signTransaction(transactionParameters, this.apiConfigService.PRIVATE_KEY)),
    ).pipe(
      catchError(this.handleError),
      switchMap((signedTransaction: TxSignature) => {
        return defer(() => from(this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction))).pipe(
          catchError(this.handleError),
        );
      }),
    );
  }

  private createTransactionParameters(transactionObject: TransactionObject<any>) {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      to: transactionObject._parent._address,
      from: this.web3.eth.accounts.privateKeyToAccount(this.apiConfigService.PRIVATE_KEY).address,
      data: transactionObject.encodeABI(),
      gas: 6721975, // London fork is implemented in Quorum and Ganache
    };
  }

  public call(transaction): Observable<any> {
    return defer(() => from(transaction.call())).pipe(
      catchError(this.handleError),
      map((res) => {
        return res;
      }),
    );
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

  public handleError(error: any): Observable<any> {
    let errorMessage = error.data ? error.data.reason : error.reason;
    errorMessage = errorMessage ? errorMessage : error.message;
    throw new BadRequestException(errorMessage);
  }
}
