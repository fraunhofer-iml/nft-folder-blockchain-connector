/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';

class TokenContractInfoDto {
  @ApiProperty()
  tokenAddress: string;

  @ApiProperty()
  tokenId: string;

  constructor(tokenAddress: string, tokenId: string) {
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;
  }
}

class TokenAssetDto {
  @ApiProperty()
  uri: string;

  @ApiProperty()
  hash: string;

  constructor(uri: string, hash: string) {
    this.uri = uri;
    this.hash = hash;
  }
}

class TokenMetadataDto {
  @ApiProperty()
  uri: string;

  @ApiProperty()
  hash: string;

  constructor(uri: string, hash: string) {
    this.uri = uri;
    this.hash = hash;
  }
}

class TokenMintDto {
  @ApiProperty()
  ownerAddress: string;

  @ApiProperty()
  asset: TokenAssetDto;

  @ApiProperty()
  metadata: TokenMetadataDto;

  @ApiProperty()
  remoteId: string;

  @ApiProperty()
  additionalInformation: string;

  constructor(
    ownerAddress: string,
    asset: TokenAssetDto,
    metadata: TokenMetadataDto,
    remoteId: string,
    additionalInformation: string,
  ) {
    this.ownerAddress = ownerAddress;
    this.asset = asset;
    this.metadata = metadata;
    this.remoteId = remoteId;
    this.additionalInformation = additionalInformation;
  }
}

class TokenGetDto extends TokenMintDto {
  @ApiProperty()
  tokenAddress: string;

  @ApiProperty()
  tokenId: string;

  constructor(
    tokenAddress: string,
    tokenId: string,
    ownerAddress: string,
    asset: TokenAssetDto,
    metadata: TokenMetadataDto,
    remoteId: string,
    additionalInformation: string,
  ) {
    super(ownerAddress, asset, metadata, remoteId, additionalInformation);
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;
  }
}

class TokenUpdateDto {
  @ApiProperty()
  assetUri: string;

  @ApiProperty()
  assetHash: string;

  @ApiProperty()
  metadataUri: string;

  @ApiProperty()
  metadataHash: string;

  @ApiProperty()
  additionalInformation: string;

  constructor(
    assetUri: string,
    assetHash: string,
    metadataUri: string,
    metadataHash: string,
    additionalInformation: string,
  ) {
    this.assetUri = assetUri;
    this.assetHash = assetHash;
    this.metadataUri = metadataUri;
    this.metadataHash = metadataHash;
    this.additionalInformation = additionalInformation;
  }
}

export { TokenContractInfoDto, TokenAssetDto, TokenMetadataDto, TokenMintDto, TokenGetDto, TokenUpdateDto };
