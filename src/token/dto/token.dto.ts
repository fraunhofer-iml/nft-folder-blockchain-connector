/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

import { IsValidBlockchainAddress } from '../../shared/validator/BlockchainAddressValidator';

class TokenInformationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsValidBlockchainAddress()
  tokenAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
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
  remoteId: string;

  @ApiProperty()
  asset: TokenAssetDto;

  @ApiProperty()
  metadata: TokenMetadataDto;

  @ApiProperty()
  additionalInformation: string;

  @ApiProperty()
  ownerAddress: string;

  constructor(
    remoteId: string,
    asset: TokenAssetDto,
    metadata: TokenMetadataDto,
    additionalInformation: string,
    ownerAddress: string,
  ) {
    this.remoteId = remoteId;
    this.asset = asset;
    this.metadata = metadata;
    this.additionalInformation = additionalInformation;
    this.ownerAddress = ownerAddress;
  }

  static createWithDefaultValues(): TokenMintDto {
    return new TokenMintDto('', new TokenAssetDto('', ''), new TokenMetadataDto('', ''), '', '');
  }
}

class TokenGetDto extends TokenMintDto {
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
    super(remoteId, asset, metadata, additionalInformation, ownerAddress);
    this.minterAddress = minterAddress;
    this.createdOn = createdOn;
    this.lastUpdatedOn = lastUpdatedOn;
    this.tokenId = tokenId;
    this.tokenAddress = tokenAddress;
  }
}

class TokenUpdateDto {
  @ApiProperty()
  assetUri?: string;

  @ApiProperty()
  assetHash?: string;

  @ApiProperty()
  metadataUri?: string;

  @ApiProperty()
  metadataHash?: string;

  @ApiProperty()
  additionalInformation?: string;
}

export { TokenInformationDto, TokenAssetDto, TokenMetadataDto, TokenMintDto, TokenGetDto, TokenUpdateDto };
