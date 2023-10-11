/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';
import { TokenContractInfoDto } from '../../token/dto/token.dto';

export class SegmentReadDto {
  @ApiProperty()
  segmentAddress: string;

  @ApiProperty()
  segmentName: string;

  @ApiProperty()
  tokenContractInfos: TokenContractInfoDto[];

  constructor(segmentAddress: string, segmentName: string, tokenContractInfos: TokenContractInfoDto[]) {
    this.segmentAddress = segmentAddress;
    this.segmentName = segmentName;
    this.tokenContractInfos = tokenContractInfos;
  }
}
