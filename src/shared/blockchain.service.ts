/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Block, Contract, TransactionResponse, Wallet } from 'ethers';

import { ApiConfigService } from '../config/api.config.service';

@Injectable()
export class BlockchainService {
  private contractInstances: Contract[] = [];

  constructor(
    @Inject('EthersProvider') public readonly provider: any,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  public returnSignerAddress(): string {
    return this.returnSignerWallet().address;
  }

  private returnSignerWallet(): Wallet {
    return new Wallet(this.apiConfigService.PRIVATE_KEY, this.provider);
  }

  public getContract(contractAddress: string, abi: any): Contract {
    const wallet: Wallet = this.returnSignerWallet();

    let contractInstance = this.contractInstances.find((contract: Contract) => contract.target === contractAddress);

    if (!contractInstance) {
      contractInstance = new Contract(contractAddress, abi, wallet);

      this.contractInstances.push(contractInstance);
    }

    return contractInstance;
  }

  public async fetchTransactionTimestamp(transactionHash: string): Promise<number> {
    const transaction: TransactionResponse = await this.provider.getTransaction(transactionHash);

    if (!transaction || !transaction.blockNumber) {
      throw new BadRequestException('Transaction not found or not yet confirmed.');
    }

    const block: Block = await this.provider.getBlock(transaction.blockNumber);

    if (!block || !block.timestamp) {
      throw new BadRequestException('Block not found or timestamp is missing.');
    }

    return block.timestamp;
  }

  public handleError(error: any): void {
    const encodedErrorData = error.info?.error?.data;
    const decodedErrorData = encodedErrorData ? this.contractInstances[0].interface.parseError(encodedErrorData) : null;

    const callError = error?.revert?.name;
    const transactionError = decodedErrorData?.name;
    const errorMessage = callError ? callError : transactionError;

    throw new BadRequestException(errorMessage);
  }
}
