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
import { TokenMintDto } from '../dto/token-mint.dto';
import { TokenReadDto } from '../dto/token-read.dto';
import { TokenAssetDto } from '../dto/token.asset.dto';
import { TokenMetadataDto } from '../dto/token.metadata.dto';
import { TokenHierarchyDto } from '../dto/token.hierarchy.dto';
import { EventService } from './event.service';

@Injectable()
export class TokenMintService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
    private readonly eventService: EventService,
    @Inject('EthersProvider') protected readonly ethersProvider: JsonRpcProvider,
  ) {
    super(blockchainService, configurationService);
  }

  public async mintToken(dto: TokenMintDto, appendToHierarchy: boolean): Promise<TokenReadDto> {
    try {
      const transactionResponse: TransactionResponse = appendToHierarchy
        ? await this.tokenInstance.mintTokenAndAppendToHierarchy(
            this.blockchainService.returnSignerAddress(),
            dto.remoteId,
            dto.asset.uri,
            dto.asset.hash,
            dto.metadata.uri,
            dto.metadata.hash,
            dto.additionalData,
            dto.parentIds,
          )
        : await this.tokenInstance.mintToken(
            this.blockchainService.returnSignerAddress(),
            dto.remoteId,
            dto.asset.uri,
            dto.asset.hash,
            dto.metadata.uri,
            dto.metadata.hash,
            dto.additionalData,
          );

      await this.blockchainService.waitForTheNextBlock();

      // At this point, we don't know the token id
      // The only way to get the stored token is to parse the logs
      const transactionReceipt: TransactionReceipt = await this.ethersProvider.getTransactionReceipt(
        transactionResponse.hash,
      );
      const decodedLogs: LogDescription[] = this.decodeLogs(transactionReceipt);
      const transactionTimestamp: string = await this.fetchTransactionTimestampForReceipt(transactionReceipt);
      return this.assembleDto(decodedLogs, transactionTimestamp);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  private decodeLogs(transactionReceipt: TransactionReceipt): LogDescription[] {
    const contractInterface = new Interface(this.tokenInstance.interface.fragments);
    const decodedLogs: LogDescription[] = this.eventService.decodeLogs(contractInterface, transactionReceipt, [
      'TokenMinted',
      'NodeAppendedToHierarchy',
    ]);
    this.logger.log(
      `### Token Minted ###
       TxId: ${transactionReceipt.hash}
       Token ${decodedLogs?.[0]?.args[1]} minted
       TokenMinted: ${decodedLogs?.[0]?.args}
       NodeAppendedToHierarchy: ${decodedLogs?.[1]?.args}`,
    );

    return decodedLogs;
  }

  private async fetchTransactionTimestampForReceipt(transactionReceipt: TransactionReceipt): Promise<string> {
    return this.blockchainService.fetchTransactionTimestamp(transactionReceipt.hash);
  }

  private assembleDto(decodedLogs: LogDescription[], transactionTimestamp: string): TokenReadDto {
    const remoteId = decodedLogs[0].args[2];
    const tokenAssetDto = new TokenAssetDto(decodedLogs[0].args[3], decodedLogs[0].args[4]);
    const tokenMetadataDto = new TokenMetadataDto(decodedLogs[0].args[5], decodedLogs[0].args[6]);
    const additionalData = decodedLogs[0].args[7];
    const tokenHierarchyDto = decodedLogs[1]
      ? new TokenHierarchyDto(
          true,
          [],
          decodedLogs[1].args[1].map((id: string) => Number(id)),
        )
      : undefined;
    const ownerAddress = decodedLogs[0].args[0];
    const minterAddress = decodedLogs[0].args[0]; // receiver is minter
    const createdOn = transactionTimestamp;
    const lastUpdatedOn = transactionTimestamp; // createdOn and lastUpdatedOn are the same when minting
    const tokenId = Number(decodedLogs[0].args[1]);
    const tokenAddress = this.configurationService.getBlockchainConfiguration().tokenAddress;

    return new TokenReadDto(
      remoteId,
      tokenAssetDto,
      tokenMetadataDto,
      additionalData,
      tokenHierarchyDto,
      ownerAddress,
      minterAddress,
      createdOn,
      lastUpdatedOn,
      tokenId,
      tokenAddress,
    );
  }
}
