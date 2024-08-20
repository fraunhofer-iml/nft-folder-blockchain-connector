/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { GENERAL_CONFIG_IDENTIFIER, GeneralConfiguration } from './configurations/general.configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  public getGeneralConfiguration(): GeneralConfiguration | undefined {
    return this.configService.get<GeneralConfiguration>(GENERAL_CONFIG_IDENTIFIER);
  }
}
