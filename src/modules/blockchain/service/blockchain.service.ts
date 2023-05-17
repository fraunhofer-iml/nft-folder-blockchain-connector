/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { catchError, defer, from, map, Observable, switchMap } from 'rxjs';
import TransactionReceipt from 'web3/types';
import { Account, TxSignature } from 'web3/eth/accounts';
import { TransactionObject } from 'web3/eth/types';

import { ApiConfigService } from '../../../config/apiConfig.service';

@Injectable()
export class BlockchainService {
  constructor(@Inject('Web3Service') public readonly web3: any, private readonly apiConfigService: ApiConfigService) {
    this.web3.eth.handleRevert = true;
  }

  public sendTransaction(transactionObject: TransactionObject<any>): Observable<TransactionReceipt> {
    const account: Account = this.web3.eth.accounts.privateKeyToAccount(this.apiConfigService.PRIVATE_KEY);
    const transaction = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      to: transactionObject._parent._address,
      from: account.address,
      data: transactionObject.encodeABI(),
      maxFeePerGas: 6721975000,
      gasLimit: 6721975,
    };

    return defer(() => from(this.web3.eth.accounts.signTransaction(transaction, account.privateKey))).pipe(
      catchError(this.handleError),
      switchMap((signedTransaction: TxSignature) => {
        return defer(() => from(this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction))).pipe(
          catchError(this.handleError),
        );
      }),
    );
  }

  public call(transaction): Observable<any> {
    return defer(() => from(transaction.call())).pipe(
      catchError(this.handleError),
      map((res) => {
        return res;
      }),
    );
  }

  public handleError(error: any): Observable<any> {
    const errorMessage = error.data ? error.data.reason : error.reason;
    throw new BadRequestException(errorMessage);
  }
}
