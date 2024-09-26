/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DataIntegrityFileService } from './service/data-integrity-file.service';
import { DataIntegrityStringService } from './service/data-integrity-string.service';

@Controller('data-integrities')
@ApiTags('Data Integrities')
export class DataIntegrityController {
  constructor(
    private readonly dataIntegrityFileService: DataIntegrityFileService,
    private readonly dataIntegrityStringService: DataIntegrityStringService,
  ) {}

  @Post('files/hash')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hash a file and return its hash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileToHash: {
          type: 'string',
          format: 'binary',
          description: 'The file to hash (e.g., PDF, image, etc.)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('fileToHash'))
  hashFile(@UploadedFile() fileToHash: Express.Multer.File): Promise<string> {
    return this.dataIntegrityFileService.hashFile(fileToHash);
  }

  @Post('files/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify if a file has the same hash as its original hash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileToHash: {
          type: 'string',
          format: 'binary',
          description: 'The file to hash (e.g., PDF, image, etc.)',
        },
        originalHash: {
          type: 'string',
          format: 'hexadecimal',
          description: 'The original hash of the file, represented as a 64-character hexadecimal string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('fileToHash'))
  async verifyFile(
    @UploadedFile() fileToHash: Express.Multer.File,
    @Body() body: { originalHash: string },
  ): Promise<boolean> {
    return this.dataIntegrityFileService.verifyFile(fileToHash, body.originalHash);
  }

  @Post('strings/hash')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hash a string and return its hash' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stringToHash: {
          type: 'string',
          description: 'The string to hash',
        },
      },
    },
  })
  hashString(@Body() body: { stringToHash: string }): Promise<string> {
    return this.dataIntegrityStringService.hashString(body.stringToHash);
  }

  @Post('strings/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify if a string has the same hash as its original hash' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stringToHash: {
          type: 'string',
          description: 'The string to hash',
        },
        originalHash: {
          type: 'string',
          format: 'hexadecimal',
          description: 'The original hash of the string, represented as a 64-character hexadecimal string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('fileToHash'))
  async verifyString(@Body() body: { stringToHash: string; originalHash: string }): Promise<boolean> {
    return this.dataIntegrityStringService.verifyString(body.stringToHash, body.originalHash);
  }
}
