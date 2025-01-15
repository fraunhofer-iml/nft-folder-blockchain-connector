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

export class TokenMintDto {
  @ApiProperty()
  remoteId: string;

  @ApiProperty()
  asset: TokenAssetDto;

  @ApiProperty()
  metadata: TokenMetadataDto;

  @ApiProperty()
  additionalData: string;

  @ApiProperty({ type: [Number] })
  parentIds: number[];

  constructor(
    remoteId: string = '',
    asset: TokenAssetDto = new TokenAssetDto('', ''),
    metadata: TokenMetadataDto = new TokenMetadataDto('', ''),
    additionalData: string = '',
    parentIds: number[],
  ) {
    this.remoteId = remoteId;
    this.asset = asset;
    this.metadata = metadata;
    this.additionalData = additionalData;
    this.parentIds = parentIds;
  }
}
