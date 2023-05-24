/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';

// TODO-MP: use inheritance
// TODO-MP: remove public

class OriginTokenDto {
  @ApiProperty()
  public tokenAddress: string;

  @ApiProperty()
  public tokenId: string;

  constructor(tokenAddress: string, tokenId: string) {
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;
  }
}

class AssetDto {
  @ApiProperty()
  public uri: string;

  @ApiProperty()
  public hash: string;

  constructor(uri: string, hash: string) {
    this.uri = uri;
    this.hash = hash;
  }
}

class MetadataDto {
  @ApiProperty()
  public uri: string;

  @ApiProperty()
  public hash: string;

  constructor(uri: string, hash: string) {
    this.uri = uri;
    this.hash = hash;
  }
}

class MintTokenDto {
  @ApiProperty()
  public ownerAddress: string;

  @ApiProperty()
  public asset: AssetDto;

  @ApiProperty()
  public metadata: MetadataDto;

  @ApiProperty()
  public remoteId: string;

  @ApiProperty()
  public additionalInformation: string;

  constructor(ownerAddress: string, asset: AssetDto, metadata: MetadataDto, additionalInformation: string) {
    this.ownerAddress = ownerAddress;
    this.asset = asset;
    this.metadata = metadata;
    this.additionalInformation = additionalInformation;
  }
}

class GetTokenDto {
  @ApiProperty()
  public tokenAddress: string;

  @ApiProperty()
  public tokenId: string;

  @ApiProperty()
  public ownerAddress: string;

  @ApiProperty()
  public asset: AssetDto;

  @ApiProperty()
  public metadata: MetadataDto;

  @ApiProperty()
  public remoteId: string;

  @ApiProperty()
  public additionalInformation: string;

  constructor(
    tokenAddress: string,
    tokenId: string,
    ownerAddress: string,
    asset: AssetDto,
    metadata: MetadataDto,
    remoteId: string,
    additionalInformation: string,
  ) {
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;
    this.ownerAddress = ownerAddress;
    this.asset = asset;
    this.metadata = metadata;
    this.remoteId = remoteId;
    this.additionalInformation = additionalInformation;
  }
}

export { OriginTokenDto, MintTokenDto, GetTokenDto, AssetDto, MetadataDto };
