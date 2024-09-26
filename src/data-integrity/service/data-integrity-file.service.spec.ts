/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { DataIntegrityFileService } from './data-integrity-file.service';

const FILE_BUFFER = Buffer.from('test file content');
const FILE_TO_HASH = { buffer: FILE_BUFFER } as Express.Multer.File;
const ORIGINAL_HASH = crypto.createHash('sha256').update(FILE_BUFFER).digest('hex');

describe('DataIntegrityFileService', () => {
  let service: DataIntegrityFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataIntegrityFileService],
    }).compile();

    service = module.get<DataIntegrityFileService>(DataIntegrityFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashFile', () => {
    it('should hash a file', async () => {
      const hash = await service.hashFile(FILE_TO_HASH);
      expect(hash).toBe(ORIGINAL_HASH);
    });

    it('should throw BadRequestException if file is not provided', async () => {
      await expect(() => service.hashFile(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyFile', () => {
    it('should verify a file and be true', async () => {
      const valid = await service.verifyFile(FILE_TO_HASH, ORIGINAL_HASH);
      expect(valid).toBeTruthy();
    });

    it('should verify a file and be false', async () => {
      const valid = await service.verifyFile(
        FILE_TO_HASH,
        'f234c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
      );
      expect(valid).toBeFalsy();
    });

    it('should throw BadRequestException if file and original hash are not provided', async () => {
      await expect(() => service.verifyFile(null, null)).rejects.toThrow(
        'The file to hash and its original hash must be provided',
      );
    });

    it('should throw BadRequestException if original hash is not provided', async () => {
      await expect(() => service.verifyFile(null, ORIGINAL_HASH)).rejects.toThrow('The file to hash must be provided');
    });

    it('should throw BadRequestException if original hash is not provided', async () => {
      await expect(() => service.verifyFile(FILE_TO_HASH, null)).rejects.toThrow('The original hash must be provided');
    });

    it('should throw BadRequestException if original hash is not a valid SHA-256 hash', async () => {
      await expect(() => service.verifyFile(FILE_TO_HASH, 'test')).rejects.toThrow(
        'The original hash is not a valid SHA-256 hash',
      );
    });
  });
});
