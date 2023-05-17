/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';
import { OriginTokenDto } from './token.dto';

export class GetSegmentDto {
  @ApiProperty()
  public segmentAddress: string;

  @ApiProperty()
  public segmentName: string;

  @ApiProperty()
  public tokens: OriginTokenDto[];

  constructor(segmentAddress: string, segmentName: string, tokens: OriginTokenDto[]) {
    this.segmentAddress = segmentAddress;
    this.segmentName = segmentName;
    this.tokens = tokens;
  }
}
