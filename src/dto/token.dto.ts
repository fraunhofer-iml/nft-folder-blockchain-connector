/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  public tokenAddress: string;
  @ApiProperty()
  public tokenId: number;
  @ApiProperty()
  public segmentAddress: string;

  constructor(tokenAddress: string, tokenId: number, segmentAddress: string) {
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;
    this.segmentAddress = segmentAddress;
  }
}
