/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import Web3 from 'web3';

import { BlockchainService } from './blockchain.service';
import { ApiConfigService } from '../../../config/apiConfig.service';

// TODO-LG: fix and add more tests for Blockchain
describe('BlockchainService', () => {
  let service: BlockchainService;
  let fakeApiConfigService: Partial<ApiConfigService>;

  /*
    const fakeParent = { _address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' };
    function encodeABI() {
      return '';
    }
    const fakeTransaction = {
      _parent: fakeParent,
      encodeABI: () => '',
    };
  */

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);

  beforeEach(async () => {
    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    fakeApiConfigService = {
      PRIVATE_KEY: 'testPrivateKey',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainService,
        {
          provide: 'Web3Service',
          useValue: WEB3,
        },
        {
          provide: ApiConfigService,
          useValue: fakeApiConfigService,
        },
      ],
    }).compile();
    service = module.get<BlockchainService>(BlockchainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
