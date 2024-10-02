/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
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
