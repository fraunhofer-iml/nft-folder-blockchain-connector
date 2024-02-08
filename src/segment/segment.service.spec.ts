/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import { AbiItem } from 'web3-utils';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';
import Web3 from 'web3';

import { SegmentService } from './segment.service';
import { ApiConfigService } from '../config/api.config.service';
import { BlockchainService } from '../shared/blockchain.service';
import { areMethodsEqual } from '../shared/test.utils';

import { SegmentReadDto } from './dto/segment.read.dto';
import { SegmentAbi } from './abi/segment.abi';
import { ContainerAbi } from './abi/container.abi';
import { TokenContractInfoDto } from '../token/dto/token.dto';

describe('SegmentService', () => {
  let service: SegmentService;
  let fakeBlockchainService: Partial<BlockchainService>;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // test input
  const INPUT_SEGMENT_NAME = 'inputSegmentName';
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const INPUT_TOKEN_ID = 12;
  const INPUT_TOKEN_ADDRESS_2 = 'inputTokenAddress2';
  const INPUT_TOKEN_ID_2 = 15;
  const INPUT_SEGMENT_INDEX = 1;

  // test output
  const OUTPUT_CREATE_SEGMENT: any = {};
  const OUTPUT_ADD_TOKEN: any = {};
  const OUTPUT_REMOVE_TOKEN: any = {};

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);
  const CONTAINER_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const SEGMENT_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';

  const TOKEN_CONTRACT_INFO = new TokenContractInfoDto(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID.toString());
  const TOKEN_CONTRACT_INFO_2 = new TokenContractInfoDto(INPUT_TOKEN_ADDRESS_2, INPUT_TOKEN_ID_2.toString());

  const SINGLE_SEGMENT = new SegmentReadDto(SEGMENT_ADDRESS, INPUT_SEGMENT_NAME, [
    TOKEN_CONTRACT_INFO,
    TOKEN_CONTRACT_INFO_2,
  ]);

  beforeEach(async () => {
    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const containerContract = new WEB3.eth.Contract(ContainerAbi as AbiItem[], CONTAINER_ADDRESS);
    const containerContractMethods = containerContract.methods;

    const segmentContract = new WEB3.eth.Contract(SegmentAbi as AbiItem[], SEGMENT_ADDRESS);
    const segmentContractMethods = segmentContract.methods;

    fakeBlockchainService = {
      web3: WEB3,
      sendTransaction: (transaction: TransactionObject<any>): Promise<TransactionReceipt> => {
        if (areMethodsEqual(transaction, containerContractMethods.createSegment(INPUT_SEGMENT_NAME))) {
          return Promise.resolve(OUTPUT_CREATE_SEGMENT);
        } else if (areMethodsEqual(transaction, segmentContractMethods.addToken(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID))) {
          return Promise.resolve(OUTPUT_ADD_TOKEN);
        } else if (
          areMethodsEqual(transaction, segmentContractMethods.removeToken(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID))
        ) {
          return Promise.resolve(OUTPUT_REMOVE_TOKEN);
        }
      },
      call: (transaction: any): Promise<any> => {
        if (areMethodsEqual(transaction, containerContractMethods.getAllSegments())) {
          return Promise.resolve([SEGMENT_ADDRESS]);
        } else if (areMethodsEqual(transaction, containerContractMethods.getSegment(INPUT_SEGMENT_INDEX))) {
          return Promise.resolve(SINGLE_SEGMENT.segmentAddress);
        } else if (areMethodsEqual(transaction, segmentContractMethods.getName())) {
          return Promise.resolve(INPUT_SEGMENT_NAME);
        } else if (areMethodsEqual(transaction, segmentContractMethods.getAllTokenInformation())) {
          return Promise.resolve([
            [TOKEN_CONTRACT_INFO.tokenAddress, TOKEN_CONTRACT_INFO.tokenId],
            [TOKEN_CONTRACT_INFO_2.tokenAddress, TOKEN_CONTRACT_INFO_2.tokenId],
          ]);
        }
      },
    };

    fakeApiConfigService = { CONTAINER_ADDRESS: CONTAINER_ADDRESS };

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
        SegmentService,
      ],
    }).compile();
    service = module.get<SegmentService>(SegmentService);
  });

  it('should create a segment', async () => {
    expect(await service.createSegment(INPUT_SEGMENT_NAME)).toEqual(OUTPUT_CREATE_SEGMENT);
  });

  it('should get all segments', async () => {
    expect(await service.getAllSegments()).toEqual([SINGLE_SEGMENT]);
  });

  it('should get a specific segment', async () => {
    expect(await service.getSegment(INPUT_SEGMENT_INDEX)).toEqual(SINGLE_SEGMENT);
  });

  it('should add a token to a segment', async () => {
    expect(await service.addToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID)).toEqual(OUTPUT_ADD_TOKEN);
  });

  it('should remove a token from a segment', async () => {
    expect(await service.removeToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID)).toEqual(
      OUTPUT_REMOVE_TOKEN,
    );
  });
});
