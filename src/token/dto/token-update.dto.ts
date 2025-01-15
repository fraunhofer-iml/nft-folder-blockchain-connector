/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
