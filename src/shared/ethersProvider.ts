/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { JsonRpcProvider } from 'ethers';
import { ConfigurationService } from 'src/configuration/configuration.service';

export const EthersProvider = {
  provide: 'EthersProvider',
  useFactory: async (configurationService: ConfigurationService) => {
    return new JsonRpcProvider(configurationService.getBlockchainConfiguration().blockchainUrl);
  },
  inject: [ConfigurationService],
};
