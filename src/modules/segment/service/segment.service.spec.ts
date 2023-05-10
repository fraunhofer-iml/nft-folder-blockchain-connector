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

import { SegmentService } from './segment.service';
import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { areMethodsEqual } from '../../utils/test.utils';
import { SegmentAbi } from './segment.abi';

describe('SegmentService', () => {
  let service: SegmentService;
  let fakeBlockchainConnectorService: Partial<BlockchainConnectorService>;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // test input
  const INPUT_TOKEN_ADDRESS = 'inputTokenAddress';
  const INPUT_TOKEN_ID = 12;
  const INPUT_TOKEN_INDEX = 10;
  const INPUT_SEGMENT_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';

  // test output
  const OUTPUT_ADD_TOKEN = 'outputAddToken';
  const OUTPUT_REMOVE_TOKEN = 'outputRemoveToken';
  const OUTPUT_GET_NAME = 'outputGetName';
  const OUTPUT_GET_CONTAINER = 'outputGetContainer';
  const OUTPUT_GET_ALL_TOKEN_INFORMATION = [];
  const OUTPUT_GET_TOKEN_INFORMATION = 'outputGetTokenInformation';
  const OUTPUT_GET_NUMBER_OF_TOKEN_INFORMATION = 5;
  const OUTPUT_IS_TOKEN_IN_SEGMENT = true;

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);

  beforeEach(async () => {
    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const contract = new WEB3.eth.Contract(SegmentAbi as AbiItem[], INPUT_SEGMENT_ADDRESS);
    const contractMethods = contract.methods;

    fakeBlockchainConnectorService = {
      web3: WEB3,
      sendTransaction: (transaction) => {
        if (areMethodsEqual(transaction, contractMethods.addToken(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID))) {
          return of(OUTPUT_ADD_TOKEN);
        } else if (areMethodsEqual(transaction, contractMethods.removeToken(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID))) {
          return of(OUTPUT_REMOVE_TOKEN);
        } else {
          console.error(`Internal test error: transaction method '${transaction._method.name}' not found`);
        }
      },
      call: (transaction) => {
        if (areMethodsEqual(transaction, contractMethods.getName())) {
          return of(OUTPUT_GET_NAME);
        } else if (areMethodsEqual(transaction, contractMethods.getContainer())) {
          return of(OUTPUT_GET_CONTAINER);
        } else if (areMethodsEqual(transaction, contractMethods.getAllTokenInformation())) {
          return of(OUTPUT_GET_ALL_TOKEN_INFORMATION);
        } else if (areMethodsEqual(transaction, contractMethods.getTokenInformation(INPUT_TOKEN_INDEX))) {
          return of(OUTPUT_GET_TOKEN_INFORMATION);
        } else if (areMethodsEqual(transaction, contractMethods.getNumberOfTokenInformation())) {
          return of(OUTPUT_GET_NUMBER_OF_TOKEN_INFORMATION);
        } else if (
          areMethodsEqual(transaction, contractMethods.isTokenInSegment(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID))
        ) {
          return of(OUTPUT_IS_TOKEN_IN_SEGMENT);
        } else {
          console.error(`Internal test error: query method '${transaction._method.name}' not found`);
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
        SegmentService,
      ],
    }).compile();
    service = module.get<SegmentService>(SegmentService);
  });

  it('should add a token to a segment', (done) => {
    service.addToken(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID, INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_ADD_TOKEN);
      done();
    });
  });

  it('should remove a token from a segment', (done) => {
    service.removeToken(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID, INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_REMOVE_TOKEN);
      done();
    });
  });

  it('should get the name of a segment', (done) => {
    service.getName(INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_NAME);
      done();
    });
  });

  it('should get the container of a segment', (done) => {
    service.getContainer(INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_CONTAINER);
      done();
    });
  });

  it('should get all token information from a segment', (done) => {
    service.getAllTokenInformation(INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_ALL_TOKEN_INFORMATION);
      done();
    });
  });

  it('should get a token information from a segment', (done) => {
    service.getTokenInformation(INPUT_SEGMENT_ADDRESS, INPUT_TOKEN_INDEX).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_TOKEN_INFORMATION);
      done();
    });
  });

  it('should get the number of token information from a segment', (done) => {
    service.getNumberOfTokenInformation(INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_NUMBER_OF_TOKEN_INFORMATION);
      done();
    });
  });

  it('should contain a token', (done) => {
    service.isTokenInSegment(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID, INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_IS_TOKEN_IN_SEGMENT);
      done();
    });
  });
});
