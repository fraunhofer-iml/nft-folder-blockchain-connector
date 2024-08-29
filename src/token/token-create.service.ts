/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Inject, Injectable } from '@nestjs/common';
import { Interface, JsonRpcProvider, LogDescription, TransactionReceipt, TransactionResponse } from 'ethers';

import { TokenBaseService } from './token-base.services';
import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import TokenCreateDto from './dto/token-create.dto';
import TokenReadDto from './dto/token-read.dto';
import TokenAssetDto from './dto/token.asset.dto';
import TokenMetadataDto from './dto/token.metadata.dto';

@Injectable()
export class TokenCreateService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
    @Inject('EthersProvider') protected readonly ethersProvider: JsonRpcProvider,
  ) {
    super(blockchainService, configurationService);
  }

  public async createToken(dto: TokenCreateDto): Promise<TokenReadDto> {
    try {
      const txResponse: TransactionResponse = await this.mintTokenOnBlockchain(dto);
      await this.blockchainService.waitForTheNextBlock();

      // At this point, we don't know the token id
      // The only way to get the stored token is to parse the logs
      const txReceipt: TransactionReceipt = await this.ethersProvider.getTransactionReceipt(txResponse.hash);
      return this.parseMintedToken(txReceipt);
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  private async mintTokenOnBlockchain(dto: TokenCreateDto): Promise<TransactionResponse> {
    return this.tokenInstance.safeMint(
      this.blockchainService.returnSignerAddress(),
      dto.asset.uri,
      dto.asset.hash,
      dto.metadata.uri,
      dto.metadata.hash,
      dto.remoteId,
      dto.additionalInformation,
    );
  }

  private async parseMintedToken(txReceipt: TransactionReceipt): Promise<TokenReadDto> {
    const tokenInterface = new Interface(this.tokenInstance.interface.fragments);
    const decodedLogs: LogDescription[] = txReceipt.logs
      .map((encodedLog) => {
        const decodedLog = tokenInterface.parseLog(encodedLog);
        return decodedLog.name === 'TokenMinted' ? decodedLog : null;
      })
      .filter((decodedLog) => {
        return decodedLog !== null && decodedLog !== undefined;
      });

    if (decodedLogs.length === 0) {
      throw new Error("No 'TokenMinted' event found in transaction receipt logs");
    }

    const txTimestamp = await this.blockchainService.fetchTransactionTimestamp(txReceipt.hash);

    return new TokenReadDto(
      decodedLogs[0].args[2],
      new TokenAssetDto(decodedLogs[0].args[3], decodedLogs[0].args[4]),
      new TokenMetadataDto(decodedLogs[0].args[5], decodedLogs[0].args[6]),
      decodedLogs[0].args[7],
      decodedLogs[0].args[0],
      decodedLogs[0].args[0], // receiver is minter
      txTimestamp,
      txTimestamp, // createdOn and lastUpdatedOn are the same
      Number(decodedLogs[0].args[1]),
      this.configurationService.getGeneralConfiguration().tokenAddress,
    );
  }
}
