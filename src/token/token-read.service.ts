/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';

import { TokenBaseService } from './token-base.services';
import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { EventService, TokenInformation } from './event.service';
import { SegmentService } from 'src/segment/segment.service';
import TokenReadDto from './dto/token-read.dto';
import TokenAssetDto from './dto/token.asset.dto';
import TokenMetadataDto from './dto/token.metadata.dto';
import { SegmentReadDto } from 'src/segment/dto/segment.read.dto';

@Injectable()
export class TokenReadService extends TokenBaseService {
  constructor(
    protected readonly blockchainService: BlockchainService,
    protected readonly configurationService: ConfigurationService,
    private readonly eventInformationService: EventService,
    private readonly segmentService: SegmentService,
  ) {
    super(blockchainService, configurationService);
  }

  public async getTokensByRemoteIdAndOwner(remoteId?: string): Promise<TokenReadDto[]> {
    const tokenIds: number[] = await this.getTokenIdsByRemoteIdAndOwner(remoteId);
    return await Promise.all(tokenIds.map((tokenId) => this.getTokenByTokenId(Number(tokenId))));
  }

  private async getTokenIdsByRemoteIdAndOwner(remoteId: string): Promise<number[]> {
    const ownerAddress: string = this.blockchainService.returnSignerAddress();

    try {
      const tokenIdsForOwner: number[] = await this.tokenInstance.getTokenIdsByOwner(ownerAddress);

      if (!remoteId) {
        return tokenIdsForOwner;
      }

      const tokenIdsForRemoteId: number[] = await this.tokenInstance.getTokenIdsByRemoteId(remoteId);
      return tokenIdsForRemoteId.filter((tokenId: number) => tokenIdsForOwner.includes(tokenId));
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  public async getTokenByTokenId(tokenId: number): Promise<TokenReadDto> {
    try {
      const remoteId: string = await this.tokenInstance.getRemoteIdByTokenId(tokenId);
      const token = await this.tokenInstance.getToken(tokenId);
      const ownerAddress: string = await this.tokenInstance.ownerOf(tokenId);
      const tokenInformation: TokenInformation = await this.eventInformationService.fetchTokenInformation(tokenId);

      return new TokenReadDto(
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
      this.handleError(err);
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
}
