/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigObject } from './entity/config.object';

@Injectable()
export class ApiConfigService {
  private configurationOverwrite: ConfigObject[] = [];

  constructor(private configService: ConfigService) {}

  get PRIVATE_KEY(): string {
    return this.getConfig<string>('PRIVATE_KEY', '');
  }

  get BLOCKCHAIN_URL(): string {
    return this.getConfig<string>('BLOCKCHAIN_URL', '');
  }

  get CONTAINER_ADDRESS(): string {
    return this.getConfig<string>('CONTAINER_ADDRESS', '');
  }

  get TOKEN_ADDRESS(): string {
    return this.getConfig<string>('TOKEN_ADDRESS', '');
  }

  private getConfig<T>(tag: string, alternative: T): T {
    let config: any = this.configurationOverwrite.find((el) => el.name === tag);

    if (!config) {
      config = this.configService.get<T>(tag, alternative);
    } else {
      config = config.value;
    }

    return config;
  }
}
