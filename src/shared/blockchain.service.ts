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

import { ConfigurationService } from 'src/configuration/configuration.service';
import { ALREADY_EXISTS_CUSTOM_ERRORS, NOT_ALLOWED_CUSTOM_ERRORS, NOT_FOUND_CUSTOM_ERRORS } from './error.const';

@Injectable()
export class BlockchainService {
  private contractInstances: { [address: string]: Contract } = {};

  constructor(
    @Inject('EthersProvider') public readonly provider: any,
    private readonly configurationService: ConfigurationService,
  ) {}

  public returnSignerAddress(): string {
    return this.returnSignerWallet().address;
  }

  private returnSignerWallet(): Wallet {
    return new Wallet(this.configurationService.getGeneralConfiguration().privateKey, this.provider);
  }

  public getContractInstance(contractAddress: string, abi: any): Contract {
    const wallet: Wallet = this.returnSignerWallet();

    let contractInstance: Contract = this.contractInstances[contractAddress];

    if (!contractInstance) {
      contractInstance = new Contract(contractAddress, abi, wallet);
      this.contractInstances[contractAddress] = contractInstance;
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

  public handleError(error: any, contractAddress: string): void {
    const contractInstance: Contract = this.contractInstances[contractAddress];

    if (!contractInstance) {
      throw new InternalServerErrorException(`Contract instance not found for address ${contractAddress}`);
    }

    const callError = error?.revert?.name;

    const encodedTransactionError = error.info?.error?.data;
    const decodedTransactionError: ErrorDescription = encodedTransactionError
      ? contractInstance.interface.parseError(encodedTransactionError)
      : null;
    const transactionError: string = decodedTransactionError?.name;

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
      case 'BAD_DATA':
        throw new InternalServerErrorException('Cannot find a Smart Contract at this address.');
      case 'CALL_EXCEPTION':
        throw new InternalServerErrorException('An unknown CALL_EXCEPTION occurred.');
      case 'ECONNREFUSED':
        throw new InternalServerErrorException('Cannot connect to Blockchain.');
      default:
        throw new InternalServerErrorException(error.code ?? error);
    }
  }
}
