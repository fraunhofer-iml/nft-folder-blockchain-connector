/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';

import { TokenAssetDto } from './token.asset.dto';
import { TokenMetadataDto } from './token.metadata.dto';
import { TokenMintDto } from './token-mint.dto';
import { TokenHierarchyDto } from './token.hierarchy.dto';

export class TokenReadDto extends TokenMintDto {
  @ApiProperty()
  hierarchy: TokenHierarchyDto;

  @ApiProperty()
  ownerAddress: string;

  @ApiProperty()
  minterAddress: string;

  @ApiProperty()
  createdOn: string;

  @ApiProperty()
  lastUpdatedOn: string;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  tokenAddress: string;

  constructor(
    remoteId: string,
    asset: TokenAssetDto,
    metadata: TokenMetadataDto,
    additionalData: string,
    hierarchy: TokenHierarchyDto,
    ownerAddress: string,
    minterAddress: string,
    createdOn: string,
    lastUpdatedOn: string,
    tokenId: number,
    tokenAddress: string,
  ) {
    super(remoteId, asset, metadata, additionalData, undefined); // parentIds not needed here
    this.hierarchy = hierarchy;
    this.ownerAddress = ownerAddress;
    this.minterAddress = minterAddress;
    this.createdOn = createdOn;
    this.lastUpdatedOn = lastUpdatedOn;
    this.tokenId = tokenId;
    this.tokenAddress = tokenAddress;
  }
}
