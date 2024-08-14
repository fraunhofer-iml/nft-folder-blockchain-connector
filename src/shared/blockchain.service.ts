/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Block, Contract, ErrorDescription, TransactionResponse, Wallet } from 'ethers';

import { ApiConfigService } from '../config/api.config.service';
import { ALREADY_EXISTS_CUSTOM_ERRORS, NOT_ALLOWED_CUSTOM_ERRORS, NOT_FOUND_CUSTOM_ERRORS } from './error.const';

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
    const decodedErrorData: ErrorDescription = encodedErrorData
      ? this.contractInstances[0].interface.parseError(encodedErrorData)
      : null;

    const callError = error?.revert?.name;
    const transactionError: string = decodedErrorData?.name;
    const errorMessage = callError ? callError : transactionError;

    if (errorMessage) {
      this.handleBlockchainError(errorMessage);
    } else {
      this.handleConnectionError(error);
    }
  }

  private handleBlockchainError(errorMessage: any) {
    if (NOT_FOUND_CUSTOM_ERRORS.includes(errorMessage)) {
      throw new NotFoundException(errorMessage);
    } else if (ALREADY_EXISTS_CUSTOM_ERRORS.includes(errorMessage)) {
      throw new ConflictException(errorMessage);
    } else if (NOT_ALLOWED_CUSTOM_ERRORS.includes(errorMessage)) {
      throw new ForbiddenException(errorMessage);
    } else {
      throw new BadRequestException(errorMessage);
    }
  }

  private handleConnectionError(error: any) {
    switch (error.code) {
      case 'ECONNREFUSED':
        throw new InternalServerErrorException('Cannot connect to Blockchain.');
      case 'BAD_DATA':
        throw new InternalServerErrorException('Cannot find a Smart Contract at this address.');
      default:
        throw new InternalServerErrorException(error.code);
    }
  }
}
