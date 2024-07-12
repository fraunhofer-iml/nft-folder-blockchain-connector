/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers';

import { BlockchainService } from './blockchain.service';
import { ApiConfigService } from '../config/api.config.service';

describe('BlockchainService', () => {
  const provider: JsonRpcProvider = new JsonRpcProvider(global.ethereum);
  const wallet: HDNodeWallet = Wallet.createRandom();

  let service: BlockchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainService,
        {
          provide: 'EthersProvider',
          useValue: provider,
        },
        {
          provide: ApiConfigService,
          useValue: {
            PRIVATE_KEY: wallet.privateKey,
          },
        },
      ],
    }).compile();

    service = module.get<BlockchainService>(BlockchainService);
  });

  it('should return the signer wallet', async () => {
    const signerAddress: string = service.returnSignerAddress();
    expect(signerAddress).toEqual(wallet.address);
  });

  // TODO-MP: add test case for getContract method

  // TODO-MP: add test case for fetchTransactionTimestamp method

  // TODO-MP: add test case for handleError method
});
