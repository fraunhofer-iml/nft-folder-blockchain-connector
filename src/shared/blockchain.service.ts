/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Block, Contract, ErrorDescription, TransactionResponse, Wallet } from 'ethers';

import { ConfigurationService } from 'src/configuration/configuration.service';
import { ALREADY_EXISTS_CUSTOM_ERRORS, NOT_ALLOWED_CUSTOM_ERRORS, NOT_FOUND_CUSTOM_ERRORS } from './error.const';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly blockTime: number;
  private contractInstances: { [address: string]: Contract } = {};

  constructor(
    @Inject('EthersProvider') public readonly provider: any,
    private readonly configurationService: ConfigurationService,
  ) {
    // We need to wait for a transaction to be validated in a block, so we can get its logs
    // To be sure the transaction is validated, we wait a little bit longer (100ms)
    this.blockTime = this.configurationService.getBlockchainConfiguration().blockTime + 100;
  }

  public returnSignerAddress(): string {
    return this.returnSignerWallet().address;
  }

  private returnSignerWallet(): Wallet {
    return new Wallet(this.configurationService.getBlockchainConfiguration().privateKey, this.provider);
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

  public async fetchTransactionTimestamp(transactionHash: string): Promise<string> {
    const transaction: TransactionResponse = await this.provider.getTransaction(transactionHash);

    if (!transaction || !transaction.blockNumber) {
      throw new BadRequestException('Transaction not found or not yet confirmed.');
    }

    const block: Block = await this.provider.getBlock(transaction.blockNumber);

    if (!block || !block.timestamp) {
      throw new BadRequestException('Block not found or timestamp is missing.');
    }

    const timestamp: Date = new Date(block.timestamp * 1000);
    return timestamp.toISOString();
  }

  public async waitForTheNextBlock(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.blockTime));
  }

  public handleError(error: any, contractAddress: string): void {
    this.logger.warn(error);

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
      this.handleOtherError(error);
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

  private handleOtherError(error: any) {
    switch (error.code) {
      case 'BAD_DATA':
        throw new InternalServerErrorException('Cannot find a Smart Contract at this address.');
      case 'CALL_EXCEPTION':
        throw new InternalServerErrorException('An unknown CALL_EXCEPTION occurred.');
      case 'ECONNREFUSED':
        throw new InternalServerErrorException('Cannot connect to Blockchain.');
      default:
        if (error.code || error.message) {
          throw new InternalServerErrorException(error.code || error.message);
        } else {
          throw new InternalServerErrorException('An unknown error occurred.');
        }
    }
  }
}
