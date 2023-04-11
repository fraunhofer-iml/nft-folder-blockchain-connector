/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, defer, from, Observable, of, switchMap, tap } from 'rxjs';
import { ErrorDto } from '../../dto/error.dto';
import { ApiConfigService } from '../../settings/apiConfig.service';

@Injectable()
export class BlockchainConnectorService {
  private logger = new Logger(BlockchainConnectorService.name);
  private accounts = [];

  constructor(@Inject('Web3Service') public readonly web3: any, private apiConfigService: ApiConfigService) {
    this.fillAccountListFromWallet();
  }

  private fillAccountListFromWallet(): void {
    const wallets = this.web3._provider.wallets;

    for (const wallet in wallets) {
      const account = wallets[wallet];
      this.accounts.push({
        privateKey: '0x' + account._privKey.toString('hex'),
        publicKey: account._pubKey.toString('hex'),
        publicAddress: wallet,
      });
    }
  }

  public sendTransaction(transaction): Observable<any | ErrorDto> {
    const account = this.web3.eth.accounts.privateKeyToAccount(this.apiConfigService.PRIVATE_KEY);
    const transactionParameters = {
      gas: 6721975,
      gasPrice: 0,
      to: transaction._parent._address,
      from: account.address,
      data: transaction.encodeABI(),
    };

    this.web3.eth.handleRevert = true;

    return defer(() =>
      from(this.web3.eth.accounts.signTransaction(transactionParameters, this.apiConfigService.PRIVATE_KEY)),
    ).pipe(
      catchError((err) => {
        this.logger.error(err);
        return of(new ErrorDto(400, err));
      }),
      switchMap((signed: any) => {
        return defer(() => from(this.web3.eth.sendSignedTransaction(signed.rawTransaction))).pipe(
          catchError((err) => {
            this.logger.error(err);
            return err.reason ? of(new ErrorDto(400, err.reason)) : of(new ErrorDto(400, err.message));
          }),
        );
      }),
    );
  }

  public call(transaction): Observable<any | ErrorDto> {
    return defer(() => from(transaction.call())).pipe(
      catchError((err) => {
        this.logger.error(err);
        return of(new ErrorDto(400, err));
      }),
      tap((res) => {
        return res;
      }),
    );
  }
}
