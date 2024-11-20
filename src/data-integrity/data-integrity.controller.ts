/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DataIntegrityService } from './service/data-integrity.service';

@Controller('data-integrities')
@ApiTags('Data Integrities')
export class DataIntegrityController {
  constructor(private readonly dataIntegrityService: DataIntegrityService) {}

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
  hashFile(@UploadedFile() fileToHash: Express.Multer.File): string {
    if (!fileToHash) {
      throw new BadRequestException('A file must be provided');
    }

    const dataToHash = fileToHash.buffer;
    return this.dataIntegrityService.hashData(dataToHash);
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
    if (!fileToHash) {
      throw new BadRequestException('A file must be provided');
    }

    const dataToHash = fileToHash.buffer;
    return this.dataIntegrityService.verifyData(dataToHash, body.originalHash);
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
  hashString(@Body() body: { stringToHash: string }): string {
    if (!body.stringToHash) {
      throw new BadRequestException('A string must be provided');
    }

    const dataToHash = Buffer.from(body.stringToHash);
    return this.dataIntegrityService.hashData(dataToHash);
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
  async verifyString(@Body() body: { stringToHash: string; originalHash: string }): Promise<boolean> {
    if (!body.stringToHash) {
      throw new BadRequestException('A string must be provided');
    }

    const dataToHash = Buffer.from(body.stringToHash);
    return this.dataIntegrityService.verifyData(dataToHash, body.originalHash);
  }
}
