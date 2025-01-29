/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
