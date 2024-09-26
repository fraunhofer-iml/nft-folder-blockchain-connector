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
import { DataIntegrityStringService } from './data-integrity-string.service';

const STRING_TO_HASH = 'test string content';
const ORIGINAL_HASH = crypto.createHash('sha256').update(STRING_TO_HASH).digest('hex');

describe('DataIntegrityStringService', () => {
  let service: DataIntegrityStringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataIntegrityStringService],
    }).compile();

    service = module.get<DataIntegrityStringService>(DataIntegrityStringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashString', () => {
    it('should hash a string', async () => {
      const hash = await service.hashString(STRING_TO_HASH);
      expect(hash).toBe(ORIGINAL_HASH);
    });

    it('should throw BadRequestException if string is not provided', async () => {
      await expect(() => service.hashString(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyString', () => {
    it('should verify a string and be true', async () => {
      const valid = await service.verifyString(STRING_TO_HASH, ORIGINAL_HASH);
      expect(valid).toBeTruthy();
    });

    it('should verify a string and be false', async () => {
      const valid = await service.verifyString(
        STRING_TO_HASH,
        'f234c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
      );
      expect(valid).toBeFalsy();
    });

    it('should throw BadRequestException if string and original hash are not provided', async () => {
      await expect(() => service.verifyString(null, null)).rejects.toThrow(
        'The string to hash and its original hash must be provided',
      );
    });

    it('should throw BadRequestException if original hash is not provided', async () => {
      await expect(() => service.verifyString(null, ORIGINAL_HASH)).rejects.toThrow(
        'The string to hash must be provided',
      );
    });

    it('should throw BadRequestException if original hash is not provided', async () => {
      await expect(() => service.verifyString(STRING_TO_HASH, null)).rejects.toThrow(
        'The original hash must be provided',
      );
    });

    it('should throw BadRequestException if original hash is not a valid SHA-256 hash', async () => {
      await expect(() => service.verifyString(STRING_TO_HASH, 'test')).rejects.toThrow(
        'The original hash is not a valid SHA-256 hash',
      );
    });
  });
});
