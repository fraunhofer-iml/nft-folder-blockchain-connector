/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
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
