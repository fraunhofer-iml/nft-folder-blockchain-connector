/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export abstract class DataIntegrityService {
  abstract getBuffer(data: any): Buffer;

  hashData(data: any): string {
    const buffer = this.getBuffer(data);
    return this.hashBuffer(buffer);
  }

  verifyData(data: any, originalHash: string, name: string): boolean {
    if (!data && !originalHash) {
      throw new BadRequestException(`The ${name} to hash and its original hash must be provided`);
    }

    if (!data) {
      throw new BadRequestException(`The ${name} to hash must be provided`);
    }

    if (!originalHash) {
      throw new BadRequestException('The original hash must be provided');
    }

    if (!this.isValidSha256Hash(originalHash)) {
      throw new BadRequestException('The original hash is not a valid SHA-256 hash');
    }

    const buffer = this.getBuffer(data);
    const currentHash = this.hashBuffer(buffer);
    return currentHash === originalHash;
  }

  private hashBuffer(buffer: Buffer): string {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
  }

  private isValidSha256Hash(hash: string): boolean {
    const sha256Regex = /^[a-f0-9]{64}$/i;
    return sha256Regex.test(hash);
  }
}
