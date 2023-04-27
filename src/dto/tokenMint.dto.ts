/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

export class TokenMintDto {
  @ApiProperty()
  public receiver: string;
  @ApiProperty()
  public assetUri: string;
  @ApiProperty()
  public assetHash: string;
  @ApiProperty()
  public metadataUri: string;
  @ApiProperty()
  public metadataHash: string;
  @ApiProperty()
  public additionalInformation: string;

  constructor(
    receiver: string,
    assetUri: string,
    assetHash: string,
    metadataUri: string,
    metadataHash: string,
    additionalInformation?: string,
  ) {
    this.receiver = receiver;
    this.assetUri = assetUri;
    this.assetHash = assetHash;
    this.metadataUri = metadataUri;
    this.metadataHash = metadataHash;
    this.additionalInformation = additionalInformation;
  }
}
