/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';

import { EventService, TokenInformation } from './event.service';
import { SegmentService } from '../segment/segment.service';
import { ApiConfigService } from '../config/api.config.service';
import { BlockchainService } from '../shared/blockchain.service';

import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto, TokenUpdateDto } from './dto/token.dto';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';
import { TokenAbi } from './abi/token.abi';

@Injectable()
export class TokenService {
  private tokenContract: any;

  constructor(
    private readonly eventInformationService: EventService,
    private readonly segmentService: SegmentService,
    private readonly apiConfigService: ApiConfigService,
    private readonly blockchainService: BlockchainService,
  ) {
    this.tokenContract = new this.blockchainService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public async getTokenByRemoteId(remoteId: string): Promise<TokenGetDto> {
    const tokenId = await this.getTokenId(remoteId);
    return this.getTokenByTokenId(tokenId);
  }

  private getTokenId(remoteId: string): Promise<number> {
    return this.blockchainService.call(this.tokenContract.methods.getTokenId(remoteId));
  }

  public async getTokenByTokenId(tokenId: number): Promise<TokenGetDto> {
    const tokenInputPromise: Promise<any>[] = [
      this.blockchainService.call(this.tokenContract.methods.ownerOf(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getAssetInformation(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getMetadataUri(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getMetadataHash(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getRemoteId(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getAdditionalInformation(tokenId)),
    ];
    const [ownerAddress, assetInformation, metadataUri, metadataHash, remoteId, additionalInformation] =
      await Promise.all(tokenInputPromise);
    const asset: TokenAssetDto = new TokenAssetDto(assetInformation.assetUri, assetInformation.assetHash);
    const metadata: TokenMetadataDto = new TokenMetadataDto(metadataUri, metadataHash);
    const { minterAddress, createdOn, lastUpdatedOn }: TokenInformation =
      await this.eventInformationService.fetchTokenInformation(tokenId);
    return new TokenGetDto(
      remoteId,
      asset,
      metadata,
      additionalInformation,
      ownerAddress,
      minterAddress,
      createdOn,
      lastUpdatedOn,
      tokenId,
      this.apiConfigService.TOKEN_ADDRESS,
    );
  }

  public async getAllSegments(id: string): Promise<SegmentReadDto[]> {
    const segments: SegmentReadDto[] = await this.segmentService.getAllSegments();
    return segments.filter(
      (segment) =>
        segment.tokenContractInfos &&
        segment.tokenContractInfos.length > 0 &&
        segment.tokenContractInfos.some((token) => token.tokenId === id),
    );
  }

  public mintToken(mintTokenDto: TokenMintDto): Promise<TransactionReceipt> {
    const transactionObject: TransactionObject<any> = this.tokenContract.methods.safeMint(
      this.blockchainService.derivePublicAddressFromPrivateKey(),
      mintTokenDto.asset.uri,
      mintTokenDto.asset.hash,
      mintTokenDto.metadata.uri,
      mintTokenDto.metadata.hash,
      mintTokenDto.remoteId,
      mintTokenDto.additionalInformation,
    );
    return this.blockchainService.sendTransaction(transactionObject);
  }

  public async updateToken(remoteId: string, tokenUpdateDto: TokenUpdateDto): Promise<TransactionReceipt> {
    const tokenId: number = await this.getTokenId(remoteId);
    const transactionObject: TransactionObject<any> = this.tokenContract.methods.updateToken(
      tokenId,
      this.getValue(tokenUpdateDto.assetUri),
      this.getValue(tokenUpdateDto.assetHash),
      this.getValue(tokenUpdateDto.metadataUri),
      this.getValue(tokenUpdateDto.metadataHash),
      this.getValue(tokenUpdateDto.additionalInformation),
    );

    return this.blockchainService.sendTransaction(transactionObject);
  }

  private getValue(field: string): string {
    return field ? field : '';
  }

  public burnToken(tokenId: string): Promise<TransactionReceipt> {
    return this.blockchainService.sendTransaction(this.tokenContract.methods.burn(tokenId));
  }
}
