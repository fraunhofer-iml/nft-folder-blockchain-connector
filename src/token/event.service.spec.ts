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
import { AbiItem } from 'web3-utils';

import { BlockchainService } from '../shared/blockchain.service';
import { EventService } from './event.service';
import { ApiConfigService } from '../config/api.config.service';

import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto } from './dto/token.dto';
import { TokenAbi } from './abi/token.abi';

describe('EventService', () => {
  let service: EventService;
  let fakeBlockchainService: Partial<BlockchainService>;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const INPUT_TOKEN_RECEIVER = '0xe168326f1f10da12bbc838D9BB9d0B6241Fd518d';
  const INPUT_TOKEN_MINT_DTO: TokenMintDto = new TokenMintDto(
    INPUT_TOKEN_RECEIVER,
    new TokenAssetDto('', ''),
    new TokenMetadataDto('', ''),
    '',
    '',
  );

  // test output
  const OUTPUT_EVENT: any = { returnValues: { to: 'testReceiver' } };
  const OUTPUT_TOKEN_INFORMATION = new TokenGetDto(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    OUTPUT_EVENT.returnValues.to,
    '2001-09-09T01:46:40.000Z',
    '2001-09-09T01:46:40.000Z',
    undefined,
    undefined,
  );

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);

  beforeEach(async () => {
    fakeApiConfigService = {
      TOKEN_ADDRESS: INPUT_TOKEN_ADDRESS,
    };

    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const contract = new WEB3.eth.Contract(TokenAbi as AbiItem[], INPUT_TOKEN_ADDRESS);

    fakeBlockchainService = {
      web3: WEB3,
      derivePublicAddressFromPrivateKey(): any {
        return INPUT_TOKEN_MINT_DTO.ownerAddress;
      },
      fetchTransactionTimestamp(): any {
        return Promise.resolve('1000000000');
      },
    };
    jest.spyOn(contract, 'getPastEvents').mockImplementation(() => Promise.resolve([OUTPUT_EVENT]));
    jest.spyOn(fakeBlockchainService.web3.eth, 'Contract').mockImplementation(() => contract);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainService,
          useValue: fakeBlockchainService,
        },
        {
          provide: ApiConfigService,
          useValue: fakeApiConfigService,
        },
        EventService,
      ],
    }).compile();
    service = module.get<EventService>(EventService);
  });

  it('should get a token from a remoteId', async () => {
    expect(await service.fetchTokenInformation(INPUT_TOKEN_ID)).toEqual(OUTPUT_TOKEN_INFORMATION);
  });
});
