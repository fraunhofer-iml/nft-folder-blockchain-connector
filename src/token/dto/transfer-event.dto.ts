/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
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
