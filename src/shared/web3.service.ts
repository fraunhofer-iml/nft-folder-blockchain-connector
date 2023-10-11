/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

export const Web3Service = {
  provide: 'Web3Service',
  useFactory: async (apiConfigService: ConfigService) => {
    const web3 = new Web3(apiConfigService.get<string>('BLOCKCHAIN_URL'));
    web3.eth.handleRevert = true;
    return web3;
  },
  inject: [ConfigService],
};
