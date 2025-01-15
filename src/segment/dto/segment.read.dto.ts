/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';

import { TokenInformationDto } from 'src/token/dto/token.information.dto';

export class SegmentReadDto {
  @ApiProperty()
  segmentAddress: string;

  @ApiProperty()
  segmentName: string;

  @ApiProperty()
  tokenInformation: TokenInformationDto[];

  constructor(segmentAddress: string, segmentName: string, tokenInformation: TokenInformationDto[]) {
    this.segmentAddress = segmentAddress;
    this.segmentName = segmentName;
    this.tokenInformation = tokenInformation;
  }
}
