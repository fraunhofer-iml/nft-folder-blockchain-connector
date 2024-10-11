/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { registerAs } from '@nestjs/config';

export const BLOCKCHAIN_CONFIGURATION_IDENTIFIER = 'blockchain-configuration';

export interface BlockchainConfiguration {
  privateKey: string;
  blockchainUrl: string;
  blockTime: number;
  containerAddress: string;
  tokenAddress: string;
  containerAbi: string;
  segmentAbi: string;
  tokenAbi: string;
  endpointsEnabled: string;
}

export default registerAs(BLOCKCHAIN_CONFIGURATION_IDENTIFIER, () => ({
  privateKey: process.env.PRIVATE_KEY || '',
  blockchainUrl: process.env.BLOCKCHAIN_URL || '',
  blockTime: parseInt(process.env.BLOCK_TIME, 10) || 0,
  containerAddress: process.env.CONTAINER_ADDRESS || '',
  tokenAddress: process.env.TOKEN_ADDRESS || '',
  containerAbi: process.env.CONTAINER_ABI || '',
  segmentAbi: process.env.SEGMENT_ABI || '',
  tokenAbi: process.env.TOKEN_ABI || '',
  endpointsEnabled: process.env.ENDPOINTS_ENABLED || 'false',
}));
