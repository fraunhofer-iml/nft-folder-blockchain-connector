/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class DataIntegrityService {
  public hashData(dataToHash: Buffer): string {
    if (!dataToHash) {
      throw new BadRequestException('Data must be provided');
    }

    return this.hashBuffer(dataToHash);
  }

  public verifyData(dataToVerify: Buffer, originalHash: string): boolean {
    if (!dataToVerify && !originalHash) {
      throw new BadRequestException(`The data to hash and its original hash must be provided`);
    }

    if (!dataToVerify) {
      throw new BadRequestException(`The data to hash must be provided`);
    }

    if (!originalHash) {
      throw new BadRequestException('The original hash must be provided');
    }

    if (!this.isValidSha256Hash(originalHash)) {
      throw new BadRequestException('The original hash is not a valid SHA-256 hash');
    }

    const currentHash = this.hashBuffer(dataToVerify);
    return currentHash === originalHash;
  }

  private hashBuffer(buffer: Buffer): string {
    const hash = crypto.createHash('sha256');
    hash.update(new Uint8Array(buffer));
    return hash.digest('hex');
  }

  private isValidSha256Hash(hash: string): boolean {
    const sha256Regex = /^[a-f0-9]{64}$/i;
    return sha256Regex.test(hash);
  }
}
