/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

import { IsValidBlockchainAddress } from 'src/shared/validator/BlockchainAddressValidator';

export class TokenInformationDto {
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
