/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { catchError, defer, from, map, Observable, of, switchMap } from 'rxjs';
import { TxSignature } from 'web3/eth/accounts';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';
import { errors } from 'web3-core-helpers';
import Jsonrpc from 'web3-core-requestmanager/src/jsonrpc';

import { ApiConfigService } from '../../../config/apiConfig.service';

@Injectable()
export class BlockchainService {
  constructor(@Inject('Web3Service') public readonly web3: any, private readonly apiConfigService: ApiConfigService) {
    this.web3.eth.handleRevert = true;
  }

  public sendBatchTransactions(transactionObjects: TransactionObject<any>[]): Observable<string[]> {
    const batch = new this.web3.eth.BatchRequest();

    transactionObjects.forEach((transactionObject) => {
      const transactionParameters = this.createTransactionParameters(transactionObject);
      batch.add(this.web3.eth.sendTransaction.request(transactionParameters));
    });

    return defer(() => {
      return of(this.sendBatchAsync(batch));
    }).pipe(catchError(this.handleError));
  }

  // Credit to https://github.com/web3/web3.js/issues/3411#issuecomment-1185052107
  private sendBatchAsync(batch) {
    return new Promise((resolve) => {
      const requests = batch.requests;

      batch.requestManager.sendBatch(requests, (err, results) => {
        results = results || [];

        const response = requests
          .map((request, index) => {
            return results[index] || {};
          })
          .map((result, index) => {
            if (result && result.error) {
              return errors.ErrorResponse(result);
            }

            if (!Jsonrpc.isValidResponse(result)) {
              return errors.InvalidResponse(result);
            }

            return requests[index].format ? requests[index].format(result.result) : result.result;
          });

        resolve(response);
      });
    });
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

  public getPublicAddress(): any {
    return this.web3.eth.accounts.privateKeyToAccount(this.apiConfigService.PRIVATE_KEY).address;
  }
}
