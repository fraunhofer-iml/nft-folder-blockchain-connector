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
export class DataIntegrityFileService extends DataIntegrityService {
  async hashFile(fileToHash: Express.Multer.File): Promise<string> {
    return this.hashData(fileToHash);
  }

  async verifyFile(fileToHash: Express.Multer.File, originalHash: string): Promise<boolean> {
    return this.verifyData(fileToHash, originalHash, 'file');
  }

  getBuffer(fileToHash: Express.Multer.File): Buffer {
    if (!fileToHash) {
      throw new BadRequestException('A file must be provided');
    }

    return fileToHash.buffer;
  }
}
