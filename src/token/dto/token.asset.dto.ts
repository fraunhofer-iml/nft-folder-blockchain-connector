/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';

export class TokenAssetDto {
  @ApiProperty()
  uri: string;

  @ApiProperty()
  hash: string;

  constructor(uri: string, hash: string) {
    this.uri = uri;
    this.hash = hash;
  }
}
