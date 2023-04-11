/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  public from: string;
  @ApiProperty()
  public to: string;
  @ApiProperty()
  public tokenId: number;

  constructor(from: string, to: string, tokenId: number) {
    this.from = from;
    this.to = to;
    this.tokenId = tokenId;
  }
}
