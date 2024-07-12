/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider } from 'ethers';

export const EthersProvider = {
  provide: 'EthersProvider',
  useFactory: async (apiConfigService: ConfigService) => {
    return new JsonRpcProvider(apiConfigService.get<string>('BLOCKCHAIN_URL'));
  },
  inject: [ConfigService],
};
