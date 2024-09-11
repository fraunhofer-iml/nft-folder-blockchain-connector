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
import { SegmentReadDto } from 'src/segment/dto/segment.read.dto';
import TokenReadDto from '../dto/token-read.dto';
import TokenAssetDto from '../dto/token.asset.dto';
import TokenMetadataDto from '../dto/token.metadata.dto';
import TokenHierarchyDto from '../dto/token.hierarchy.dto';

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

  public async getTokens(remoteId?: string): Promise<TokenReadDto[]> {
    const tokenIds: number[] = await this.getTokenIds(remoteId);
    return await Promise.all(tokenIds.map((tokenId) => this.getToken(Number(tokenId))));
  }

  private async getTokenIds(remoteId: string): Promise<number[]> {
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

  public async getToken(tokenId: number): Promise<TokenReadDto> {
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
        token.node.exists
          ? new TokenHierarchyDto(
              token.node.active,
              Number(token.node.predecessorId) === 1.157920892373162e77 ? null : Number(token.node.predecessorId),
              Number(token.node.successorId) === 1.157920892373162e77 ? null : Number(token.node.successorId),
              token.node.childIds.map((childId: number) => Number(childId)),
              token.node.parentIds.map((parentId: number) => Number(parentId)),
            )
          : undefined,
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

  public async getParentIds(tokenId: number, confirmed: boolean): Promise<number[]> {
    try {
      const parentIds: number[] = await this.tokenInstance.getParentIds(tokenId, confirmed);
      return parentIds.map((parentId: number) => Number(parentId));
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  public async getChildIds(tokenId: number, confirmed: boolean): Promise<number[]> {
    try {
      const childIds: number[] = await this.tokenInstance.getChildIds(tokenId, confirmed);
      return childIds.map((childId: number) => Number(childId));
    } catch (err) {
      this.handleError(err);
      return Promise.reject(err);
    }
  }

  public async getSegments(tokenId: number): Promise<SegmentReadDto[]> {
    const segments: SegmentReadDto[] = await this.segmentService.fetchAllSegments();
    return segments.filter(
      (segment: SegmentReadDto) =>
        segment.tokenInformation &&
        segment.tokenInformation.length > 0 &&
        segment.tokenInformation.some((token) => token.tokenId === tokenId.toString()),
    );
  }
}
