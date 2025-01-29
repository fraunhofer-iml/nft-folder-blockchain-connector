/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { DataIntegrityService } from './data-integrity.service';

const FILE_TO_HASH = Buffer.from('test file content');
const ORIGINAL_HASH = crypto.createHash('sha256').update(new Uint8Array(FILE_TO_HASH)).digest('hex');

describe('DataIntegrityFileService', () => {
  let service: DataIntegrityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataIntegrityService],
    }).compile();

    service = module.get<DataIntegrityService>(DataIntegrityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashData', () => {
    it('should hash a file', async () => {
      const hash = service.hashData(FILE_TO_HASH);
      expect(hash).toBe(ORIGINAL_HASH);
    });

    it('should throw BadRequestException if data is not provided', async () => {
      expect(() => service.hashData(null)).toThrow(BadRequestException);
    });
  });

  describe('verifyData', () => {
    it('should verify a file and be true', async () => {
      const valid = service.verifyData(FILE_TO_HASH, ORIGINAL_HASH);
      expect(valid).toBeTruthy();
    });

    it('should verify a file and be false', async () => {
      const valid = service.verifyData(
        FILE_TO_HASH,
        'f234c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
      );
      expect(valid).toBeFalsy();
    });

    it('should throw BadRequestException if file and original hash are not provided', async () => {
      expect(() => service.verifyData(null, null)).toThrow('The data to hash and its original hash must be provided');
    });

    it('should throw BadRequestException if original hash is not provided', async () => {
      expect(() => service.verifyData(null, ORIGINAL_HASH)).toThrow('The data to hash must be provided');
    });

    it('should throw BadRequestException if original hash is not provided', async () => {
      expect(() => service.verifyData(FILE_TO_HASH, null)).toThrow('The original hash must be provided');
    });

    it('should throw BadRequestException if original hash is not a valid SHA-256 hash', async () => {
      expect(() => service.verifyData(FILE_TO_HASH, 'test')).toThrow('The original hash is not a valid SHA-256 hash');
    });
  });
});
