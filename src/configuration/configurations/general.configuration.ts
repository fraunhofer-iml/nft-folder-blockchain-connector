/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { registerAs } from '@nestjs/config';

export const GENERAL_CONFIG_IDENTIFIER = 'general';

export interface GeneralConfiguration {
  privateKey: string;
  blockchainUrl: string;
  blockTime: number;
  containerAddress: string;
  tokenAddress: string;
  containerAbi: string;
  segmentAbi: string;
  tokenAbi: string;
}

export default registerAs(GENERAL_CONFIG_IDENTIFIER, () => ({
  privateKey: process.env.PRIVATE_KEY || '',
  blockchainUrl: process.env.BLOCKCHAIN_URL || '',
  blockTime: parseInt(process.env.BLOCK_TIME, 10) || 0,
  containerAddress: process.env.CONTAINER_ADDRESS || '',
  tokenAddress: process.env.TOKEN_ADDRESS || '',
  containerAbi: process.env.CONTAINER_ABI || '',
  segmentAbi: process.env.SEGMENT_ABI || '',
  tokenAbi: process.env.TOKEN_ABI || '',
}));
