/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';

import { BlockchainService } from '../shared/blockchain.service';
import { EventService } from './event.service';
import { ApiConfigService } from '../config/api.config.service';
import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto } from './dto/token.dto';

describe('EventService', () => {
  let service: EventService;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const INPUT_TOKEN_RECEIVER = '0xbeeA41f89124d0bDB39E6ad399173EF9acB58A14';
  const TOKEN_MINTER_ADDRESS = '0x1602F965AB9Dc987525Ec01D6780A4769eE98fF5';
  const INPUT_TOKEN_MINT_DTO: TokenMintDto = new TokenMintDto(
    INPUT_TOKEN_RECEIVER,
    new TokenAssetDto('', ''),
    new TokenMetadataDto('', ''),
    '',
    '',
  );

  // test output
  const OUTPUT_EVENT: any = {
    _type: 'log',
    address: INPUT_TOKEN_ADDRESS,
    blockHash: '0xed978dd6e1a3059cb8293ff592c1c5fbd899fb56e750c2c53aae70cb7e9699e3',
    blockNumber: 3,
    data: '0x',
    index: 0,
    removed: false,
    args: {
      to: TOKEN_MINTER_ADDRESS,
    },
    transactionHash: '0x0fa13b6f98930a8ab187deb73c36e09ecb03088a1a1738b6f90e916164d0af09',
    transactionIndex: 0,
  };

  const OUTPUT_TOKEN_INFORMATION = new TokenGetDto(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    TOKEN_MINTER_ADDRESS,
    '2001-09-09T01:46:40.000Z',
    '2001-09-09T01:46:40.000Z',
    undefined,
    undefined,
  );

  // ethers mock
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainService,
          useValue: {
            provider: ethers.getDefaultProvider(),
            getContract() {
              return {
                filters: {
                  Transfer: jest.fn().mockImplementation(() => {
                    return null;
                  }),
                  AssetUriSet: jest.fn().mockImplementation(() => {
                    return null;
                  }),
                  AssetHashSet: jest.fn().mockImplementation(() => {
                    return null;
                  }),
                  MetadataUriSet: jest.fn().mockImplementation(() => {
                    return null;
                  }),
                  MetadataHashSet: jest.fn().mockImplementation(() => {
                    return null;
                  }),
                  AdditionalInformationSet: jest.fn().mockImplementation(() => {
                    return null;
                  }),
                },
                queryFilter: jest.fn().mockImplementation(() => {
                  return Promise.resolve([OUTPUT_EVENT]);
                }),
              };
            },
            returnSignerAddress(): any {
              return INPUT_TOKEN_MINT_DTO.ownerAddress;
            },
            fetchTransactionTimestamp(): any {
              return Promise.resolve('1000000000');
            },
          },
        },
        {
          provide: ApiConfigService,
          useValue: {
            TOKEN_ADDRESS: INPUT_TOKEN_ADDRESS,
          },
        },
        EventService,
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should get a token from a remoteId', async () => {
    expect(await service.fetchTokenInformation(INPUT_TOKEN_ID)).toEqual(OUTPUT_TOKEN_INFORMATION);
  });

  // TODO-MP: make methods package-private and add test cases for them
});
