/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import TransactionReceipt from 'web3/types';

import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { EventService, TokenInformation } from './event.service';
import { SegmentReadDto } from 'src/segment/dto/segment.read.dto';
import { SegmentService } from 'src/segment/segment.service';
import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto, TokenUpdateDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  private tokenInstance: Contract;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly configurationService: ConfigurationService,
    private readonly eventInformationService: EventService,
    private readonly segmentService: SegmentService,
  ) {
    this.tokenInstance = this.blockchainService.getContractInstance(
      this.configurationService.getGeneralConfiguration().tokenAddress,
      this.configurationService.getGeneralConfiguration().tokenAbi,
    );
  }

  public async mintToken(mintTokenDto: TokenMintDto): Promise<TransactionReceipt> {
    try {
      return await this.tokenInstance.safeMint(
        this.blockchainService.returnSignerAddress(),
        mintTokenDto.asset.uri,
        mintTokenDto.asset.hash,
        mintTokenDto.metadata.uri,
        mintTokenDto.metadata.hash,
        mintTokenDto.remoteId,
        mintTokenDto.additionalInformation,
      );
    } catch (err) {
      this.blockchainService.handleError(err, this.tokenInstance.target.toString());
      return Promise.reject(err);
    }
  }

  public async getTokensByRemoteIdAndOwner(remoteId?: string): Promise<TokenGetDto[]> {
    const tokenIds: number[] = await this.getTokenIdsByRemoteIdAndOwner(remoteId);
    return await Promise.all(tokenIds.map((tokenId) => this.getTokenByTokenId(Number(tokenId))));
  }

  private async getTokenIdsByRemoteIdAndOwner(remoteId: string): Promise<number[]> {
    const ownerAddress: string = this.blockchainService.returnSignerAddress();

    try {
      const tokenIdsForOwner: number[] = await this.tokenInstance.getTokenIdsByOwner(ownerAddress);

      if (remoteId == null) {
        return tokenIdsForOwner;
      }

      const tokenIdsForRemoteId: number[] = await this.tokenInstance.getTokenIdsByRemoteId(remoteId);
      return tokenIdsForRemoteId.filter((tokenId: number) => tokenIdsForOwner.includes(tokenId));
    } catch (err) {
      this.blockchainService.handleError(err, this.tokenInstance.target.toString());
      return Promise.reject(err);
    }
  }

  public async getTokenByTokenId(tokenId: number): Promise<TokenGetDto> {
    try {
      const remoteId: string = await this.tokenInstance.getRemoteIdByTokenId(tokenId);
      const token = await this.tokenInstance.getToken(tokenId);
      const ownerAddress: string = await this.tokenInstance.ownerOf(tokenId);
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
        this.configurationService.getGeneralConfiguration().tokenAddress,
      );
    } catch (err) {
      this.blockchainService.handleError(err, this.tokenInstance.target.toString());
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
      return await this.tokenInstance.updateToken(
        tokenId,
        this.getValue(tokenUpdateDto.assetUri),
        this.getValue(tokenUpdateDto.assetHash),
        this.getValue(tokenUpdateDto.metadataUri),
        this.getValue(tokenUpdateDto.metadataHash),
        this.getValue(tokenUpdateDto.additionalInformation),
      );
    } catch (err) {
      this.blockchainService.handleError(err, this.tokenInstance.target.toString());
      return Promise.reject(err);
    }
  }

  private getValue(field: string): string {
    return field || '';
  }

  public async burnTokenByTokenId(tokenId: number): Promise<TransactionReceipt> {
    try {
      return await this.tokenInstance.burn(tokenId);
    } catch (err) {
      this.blockchainService.handleError(err, this.tokenInstance.target.toString());
      return Promise.reject(err);
    }
  }
}
