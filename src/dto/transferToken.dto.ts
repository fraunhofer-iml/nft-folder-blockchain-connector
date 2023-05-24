/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';

export class TransferTokenDto {
  @ApiProperty()
  fromAddress: string;

  @ApiProperty()
  toAddress: string;

  constructor(fromAddress: string, toAddress: string) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
  }
}
