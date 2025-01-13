/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Logger, LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export const BLOCKCHAIN_CONFIGURATION_IDENTIFIER = 'blockchain-configuration';

export interface BlockchainConfiguration {
  port: number;
  logLevels: LogLevel[];
  swaggerPath: string;
  endpointsEnabled: string;
  blockchainUrl: string;
  blockTime: number;
  privateKey: string;
  containerAddress: string;
  tokenAddress: string;
  containerAbi: string;
  segmentAbi: string;
  tokenAbi: string;
}

export default registerAs(BLOCKCHAIN_CONFIGURATION_IDENTIFIER, () => ({
  port: parseInt(process.env.BCC_PORT, 10) || 4000,
  logLevels: (process.env.BCC_LOG_LEVELS || 'error,log').split(','),
  swaggerPath: process.env.BCC_SWAGGER_PATH || 'api',
  endpointsEnabled: process.env.BCC_ENDPOINTS_ENABLED || 'false',
  blockchainUrl: process.env.BCC_BLOCKCHAIN_URL || '',
  blockTime: parseInt(process.env.BCC_BLOCK_TIME, 10) || 0,
  privateKey: process.env.BCC_PRIVATE_KEY || '',
  containerAddress: process.env.BCC_CONTAINER_ADDRESS || '0x0',
  tokenAddress: process.env.BCC_TOKEN_ADDRESS || '0x0',
  containerAbi: readAbiFile(process.env.BCC_CONTAINER_ABI_PATH),
  segmentAbi: readAbiFile(process.env.BCC_SEGMENT_ABI_PATH),
  tokenAbi: readAbiFile(process.env.BCC_TOKEN_ABI_PATH),
}));

const logger = new Logger('BlockchainConfiguration');

function readAbiFile(filePath: string): string {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    return fs.readFileSync(absolutePath, 'utf8');
  } catch (error) {
    logger.error(`Failed to read the ABI file at ${filePath}. Using [] as the ABI for this smart contract.\n`, error);
    return '[]';
  }
}
