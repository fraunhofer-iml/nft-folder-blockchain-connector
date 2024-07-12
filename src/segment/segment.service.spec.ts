/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';

import { SegmentService } from './segment.service';
import { ApiConfigService } from '../config/api.config.service';
import { BlockchainService } from '../shared/blockchain.service';
import { SegmentReadDto } from './dto/segment.read.dto';
import { TokenInformationDto } from '../token/dto/token.dto';

describe('SegmentService', () => {
  let service: SegmentService;

  // test input
  const INPUT_SEGMENT_NAME = 'inputSegmentName';
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const INPUT_TOKEN_ID = 12;
  const INPUT_TOKEN_ADDRESS_2 = 'inputTokenAddress2';
  const INPUT_TOKEN_ID_2 = 15;
  const INPUT_SEGMENT_INDEX = 1;

  // test output
  const OUTPUT_SEGMENT: any = {};
  const OUTPUT_ADD_TOKEN: any = {};
  const OUTPUT_REMOVE_TOKEN: any = {};

  // ethers mock
  const CONTAINER_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const SEGMENT_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';

  const TOKEN_CONTRACT_INFO_1 = new TokenInformationDto(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID.toString());
  const TOKEN_CONTRACT_INFO_2 = new TokenInformationDto(INPUT_TOKEN_ADDRESS_2, INPUT_TOKEN_ID_2.toString());

  const SINGLE_SEGMENT = new SegmentReadDto(SEGMENT_ADDRESS, INPUT_SEGMENT_NAME, [
    TOKEN_CONTRACT_INFO_1,
    TOKEN_CONTRACT_INFO_2,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainService,
          useValue: {
            provider: ethers.getDefaultProvider(),
            getContract() {
              return {
                createSegment: jest.fn().mockImplementation(() => {
                  return Promise.resolve(OUTPUT_SEGMENT);
                }),
                getAllSegments: jest.fn().mockImplementation(() => {
                  return Promise.resolve([SEGMENT_ADDRESS]);
                }),
                getSegment: jest.fn().mockImplementation(() => {
                  return Promise.resolve(SINGLE_SEGMENT.segmentAddress);
                }),
                getAllTokenInformation: jest.fn().mockImplementation(() => {
                  return Promise.resolve([
                    [TOKEN_CONTRACT_INFO_1.tokenAddress, TOKEN_CONTRACT_INFO_1.tokenId],
                    [TOKEN_CONTRACT_INFO_2.tokenAddress, TOKEN_CONTRACT_INFO_2.tokenId],
                  ]);
                }),
                getName: jest.fn().mockImplementation(() => {
                  return INPUT_SEGMENT_NAME;
                }),
                addToken: jest.fn().mockImplementation(() => {
                  return Promise.resolve(OUTPUT_ADD_TOKEN);
                }),
                removeToken: jest.fn().mockImplementation(() => {
                  return Promise.resolve(OUTPUT_REMOVE_TOKEN);
                }),
              };
            },
          },
        },
        {
          provide: ApiConfigService,
          useValue: { CONTAINER_ADDRESS: CONTAINER_ADDRESS },
        },
        SegmentService,
      ],
    }).compile();

    service = module.get<SegmentService>(SegmentService);
  });

  it('should create a segment', async () => {
    expect(await service.createSegment(INPUT_SEGMENT_NAME)).toEqual(OUTPUT_SEGMENT);
  });

  it('should get all segments', async () => {
    expect(await service.fetchAllSegments()).toEqual([SINGLE_SEGMENT]);
  });

  it('should get a specific segment', async () => {
    expect(await service.fetchSegment(INPUT_SEGMENT_INDEX)).toEqual(SINGLE_SEGMENT);
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
