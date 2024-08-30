/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ApiProperty } from '@nestjs/swagger';

export default class TokenHierarchyDto {
  @ApiProperty()
  active: boolean;

  @ApiProperty()
  predecessorId: number;

  @ApiProperty()
  successorId: number;

  @ApiProperty()
  childIds: number[];

  @ApiProperty()
  parentIds: number[];

  constructor(active: boolean, predecessorId: number, successorId: number, childIds: number[], parentIds: number[]) {
    this.active = active;
    this.predecessorId = predecessorId;
    this.successorId = successorId;
    this.childIds = childIds;
    this.parentIds = parentIds;
  }
}
