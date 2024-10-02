/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Module } from '@nestjs/common';

import { DataIntegrityController } from './data-integrity.controller';
import { DataIntegrityFileService } from './service/data-integrity-file.service';
import { DataIntegrityStringService } from './service/data-integrity-string.service';

@Module({
  controllers: [DataIntegrityController],
  providers: [DataIntegrityFileService, DataIntegrityStringService],
  exports: [DataIntegrityFileService, DataIntegrityStringService],
})
export class DataIntegrityModule {}
