/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';

export class TokenUpdateDto {
  @ApiProperty()
  assetUri?: string;

  @ApiProperty()
  assetHash?: string;

  @ApiProperty()
  metadataUri?: string;

  @ApiProperty()
  metadataHash?: string;

  @ApiProperty()
  additionalData?: string;
}
