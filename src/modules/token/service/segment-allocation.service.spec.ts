/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import { AbiItem } from 'web3-utils';
import { of } from 'rxjs';
import Web3 from 'web3';

import { SegmentAllocationService } from './segment-allocation.service';
import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { areMethodsEqual } from '../../utils/test.utils';
import { TokenAbi } from './token.abi';

describe('SegmentAllocationService', () => {
  let service: SegmentAllocationService;
  let fakeBlockchainConnectorService: Partial<BlockchainConnectorService>;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_SEGMENT_INDEX = 10;
  const INPUT_SEGMENT_ADDRESS = 'inputSegmentAddress';
  const INPUT_CONTAINER_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';

  // test output
  const OUTPUT_GET_SEGMENTS = 'OUTPUT_GET_SEGMENTS';
  const OUTPUT_GET_SEGMENT = 'OUTPUT_GET_SEGMENT';
  const OUTPUT_GET_NUMBER_OF_SEGMENTS = 'OUTPUT_GET_NUMBER_OF_SEGMENTS';
  const OUTPUT_IS_TOKEN_IN_SEGMENT = true;

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);

  beforeEach(async () => {
    fakeApiConfigService = {}; // need to initialize, otherwise tests will fail

    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const contract = new WEB3.eth.Contract(TokenAbi as AbiItem[], INPUT_CONTAINER_ADDRESS);
    const contractMethods = contract.methods;

    fakeBlockchainConnectorService = {
      web3: WEB3,
      call: (transaction) => {
        if (areMethodsEqual(transaction, contractMethods.getSegments(INPUT_TOKEN_ID))) {
          return of(OUTPUT_GET_SEGMENTS);
        } else if (areMethodsEqual(transaction, contractMethods.getSegment(INPUT_TOKEN_ID, INPUT_SEGMENT_INDEX))) {
          return of(OUTPUT_GET_SEGMENT);
        } else if (areMethodsEqual(transaction, contractMethods.getNumberOfSegments(INPUT_TOKEN_ID))) {
          return of(OUTPUT_GET_NUMBER_OF_SEGMENTS);
        } else if (
          areMethodsEqual(transaction, contractMethods.isTokenInSegment(INPUT_TOKEN_ID, INPUT_SEGMENT_ADDRESS))
        ) {
          return of(OUTPUT_IS_TOKEN_IN_SEGMENT);
        }
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainConnectorService,
          useValue: fakeBlockchainConnectorService,
        },
        {
          provide: ApiConfigService,
          useValue: fakeApiConfigService,
        },
        SegmentAllocationService,
      ],
    }).compile();
    service = module.get<SegmentAllocationService>(SegmentAllocationService);
  });

  it('should get all segments for the token', (done) => {
    service.getSegments(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENTS);
      done();
    });
  });

  it('should get a segment for this token', (done) => {
    service.getSegment(INPUT_TOKEN_ID, INPUT_SEGMENT_INDEX).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENT);
      done();
    });
  });

  it('should get the number of segments for this token', (done) => {
    service.getNumberOfSegments(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_NUMBER_OF_SEGMENTS);
      done();
    });
  });

  it('should contain the token in the segment', (done) => {
    service.isTokenInSegment(INPUT_TOKEN_ID, INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_IS_TOKEN_IN_SEGMENT);
      done();
    });
  });
});
