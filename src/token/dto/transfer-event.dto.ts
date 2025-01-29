/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsValidBlockchainAddress } from '../../shared/validator/BlockchainAddressValidator';

export class TransferEventDto {
  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  @IsValidBlockchainAddress()
  senderAddress: string;

  @ApiProperty()
  @IsValidBlockchainAddress()
  receiverAddress: string;

  @ApiProperty()
  date: string;

  constructor(tokenId: number, senderAddress: string, receiverAddress: string, date: string) {
    this.tokenId = tokenId;
    this.senderAddress = senderAddress;
    this.receiverAddress = receiverAddress;
    this.date = date;
  }
}
