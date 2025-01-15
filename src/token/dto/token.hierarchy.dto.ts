/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';

export class TokenHierarchyDto {
  @ApiProperty()
  active: boolean;

  @ApiProperty()
  childIds: number[];

  @ApiProperty()
  parentIds: number[];

  constructor(active: boolean, childIds: number[], parentIds: number[]) {
    this.active = active;
    this.childIds = childIds;
    this.parentIds = parentIds;
  }
}
