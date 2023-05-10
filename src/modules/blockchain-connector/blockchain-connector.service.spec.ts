/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import Web3 from 'web3';

import { BlockchainConnectorService } from './blockchain-connector.service';
import { ApiConfigService } from '../../config/apiConfig.service';

//todo-LG: fix and add more tests for Blockchain Connector
describe('BlockchainConnectorService', () => {
  let service: BlockchainConnectorService;
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
        BlockchainConnectorService,
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
    service = module.get<BlockchainConnectorService>(BlockchainConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
