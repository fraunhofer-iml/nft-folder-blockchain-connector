/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';

import TokenAssetDto from './token.asset.dto';
import TokenMetadataDto from './token.metadata.dto';
import TokenCreateDto from './token-create.dto';

export default class TokenReadDto extends TokenCreateDto {
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
    additionalInformation: string,
    ownerAddress: string,
    minterAddress: string,
    createdOn: string,
    lastUpdatedOn: string,
    tokenId: number,
    tokenAddress: string,
  ) {
    super(remoteId, asset, metadata, additionalInformation);
    this.ownerAddress = ownerAddress;
    this.minterAddress = minterAddress;
    this.createdOn = createdOn;
    this.lastUpdatedOn = lastUpdatedOn;
    this.tokenId = tokenId;
    this.tokenAddress = tokenAddress;
  }
}
