/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Injectable } from '@nestjs/common';

import { DataIntegrityService } from './data-integrity.service';

@Injectable()
export class DataIntegrityStringService extends DataIntegrityService {
  async hashString(stringToHash: string): Promise<string> {
    return this.hashData(stringToHash);
  }

  async verifyString(stringToHash: string, originalHash: string): Promise<boolean> {
    return this.verifyData(stringToHash, originalHash, 'string');
  }

  getBuffer(stringToHash: string): Buffer {
    if (!stringToHash) {
      throw new BadRequestException('A string must be provided');
    }

    return Buffer.from(stringToHash);
  }
}
