/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
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
    this.tokenContract = this.blockchainService.getContract(this.apiConfigService.TOKEN_ADDRESS, TokenAbi);
  }

  public async mintToken(mintTokenDto: TokenMintDto): Promise<TransactionReceipt> {
    try {
      return await this.tokenContract.safeMint(
        this.blockchainService.returnSignerAddress(),
        mintTokenDto.asset.uri,
        mintTokenDto.asset.hash,
        mintTokenDto.metadata.uri,
        mintTokenDto.metadata.hash,
        mintTokenDto.remoteId,
        mintTokenDto.additionalInformation,
      );
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  public async getTokensByRemoteIdAndOwner(remoteId?: string): Promise<TokenGetDto[]> {
    const tokenIds: number[] = await this.getTokenIdsByRemoteIdAndOwner(remoteId);
    return await Promise.all(tokenIds.map((tokenId) => this.getTokenByTokenId(Number(tokenId))));
  }

  private async getTokenIdsByRemoteIdAndOwner(remoteId: string): Promise<number[]> {
    const ownerAddress = this.blockchainService.returnSignerAddress();

    try {
      const tokenIdsForOwner: number[] = await this.tokenContract.getTokenIdsForOwner(ownerAddress);

      if (remoteId == null) {
        return tokenIdsForOwner;
      }

      const tokenIdsForRemoteId: number[] = await this.tokenContract.getTokenIdsForRemoteId(remoteId);
      return tokenIdsForRemoteId.filter((tokenId: number) => tokenIdsForOwner.includes(tokenId));
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  public async getTokenByTokenId(tokenId: number): Promise<TokenGetDto> {
    try {
      const remoteId = await this.tokenContract.getRemoteId(tokenId);
      const token = await this.tokenContract.getToken(tokenId);
      const ownerAddress = await this.tokenContract.ownerOf(tokenId);
      const tokenInformation: TokenInformation = await this.eventInformationService.fetchTokenInformation(tokenId);

      return new TokenGetDto(
        remoteId,
        new TokenAssetDto(token.assetUri, token.assetHash),
        new TokenMetadataDto(token.metadataUri, token.metadataHash),
        token.additionalInformation,
        ownerAddress,
        tokenInformation.minterAddress,
        tokenInformation.createdOn,
        tokenInformation.lastUpdatedOn,
        tokenId,
        this.apiConfigService.TOKEN_ADDRESS,
      );
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  public async getSegmentsByTokenId(tokenId: number): Promise<SegmentReadDto[]> {
    const segments: SegmentReadDto[] = await this.segmentService.fetchAllSegments();
    return segments.filter(
      (segment: SegmentReadDto) =>
        segment.tokenInformation &&
        segment.tokenInformation.length > 0 &&
        segment.tokenInformation.some((token) => token.tokenId === tokenId.toString()),
    );
  }

  public async updateTokenByTokenId(tokenId: number, tokenUpdateDto: TokenUpdateDto): Promise<TransactionReceipt> {
    try {
      return await this.tokenContract.updateToken(
        tokenId,
        this.getValue(tokenUpdateDto.assetUri),
        this.getValue(tokenUpdateDto.assetHash),
        this.getValue(tokenUpdateDto.metadataUri),
        this.getValue(tokenUpdateDto.metadataHash),
        this.getValue(tokenUpdateDto.additionalInformation),
      );
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  private getValue(field: string): string {
    return field ? field : '';
  }

  public async burnTokenByTokenId(tokenId: number): Promise<TransactionReceipt> {
    try {
      return await this.tokenContract.burn(tokenId);
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }
}
