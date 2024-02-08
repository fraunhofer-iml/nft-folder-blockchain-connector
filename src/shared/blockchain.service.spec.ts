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
import { ApiConfigService } from '../config/api.config.service';
import { TransactionObject } from 'web3/eth/types';
import { TokenAbi } from '../token/abi/token.abi';
import { AbiItem } from 'web3-utils';

describe('BlockchainService', () => {
  let service: BlockchainService;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);
  const INPUT_REMOTE_ID = 'testRemoteId';
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const contract = new WEB3.eth.Contract(TokenAbi as AbiItem[], INPUT_TOKEN_ADDRESS);
  const contractMethods = contract.methods;
  const OUTPUT_ACCOUNT: any = { address: 'testAddress' };
  const SIGNED_TRANSACTION: any = { rawTransaction: 'rawTransaction' };
  const OUTPUT_TRANSACTION_RESPONSE: any = { response: 'testResponse' };
  const INPUT_TRANSACTION_OBJECT: TransactionObject<any> = contractMethods.getTokenId(INPUT_REMOTE_ID);

  const INPUT_TRANSACTION: any = {
    blockNumber: 0,
  };
  const OUTPUT_BLOCK: any = {
    timestamp: 100,
  };

  beforeEach(async () => {
    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    fakeApiConfigService = {
      PRIVATE_KEY: 'testPrivateKey',
    };

    jest.spyOn(WEB3.eth.accounts, 'privateKeyToAccount').mockImplementation(() => OUTPUT_ACCOUNT);
    jest.spyOn(WEB3.eth.accounts, 'signTransaction').mockImplementation(() => SIGNED_TRANSACTION);
    jest.spyOn(WEB3.eth, 'sendSignedTransaction').mockImplementation(() => OUTPUT_TRANSACTION_RESPONSE);
    jest.spyOn(WEB3.eth, 'getTransaction').mockImplementation(() => INPUT_TRANSACTION);
    jest.spyOn(WEB3.eth, 'getBlock').mockImplementation(() => OUTPUT_BLOCK);

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

  it('should send transaction', async () => {
    expect(await service.sendTransaction(INPUT_TRANSACTION_OBJECT)).toEqual(OUTPUT_TRANSACTION_RESPONSE);
  });

  it('should derive public address from private key', async () => {
    expect(await service.derivePublicAddressFromPrivateKey()).toEqual(OUTPUT_ACCOUNT.address);
  });
});
