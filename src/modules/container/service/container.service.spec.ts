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

import { ContainerService } from './container.service';
import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { containerAbi } from './container.abi';

describe('ContainerService', () => {
  let service: ContainerService;
  let fakeBlockchainConnectorService: Partial<BlockchainConnectorService>;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // test input
  const SEGMENT_NAME = 'fakeSegmentName';
  const SEGMENT_INDEX = 5;
  const SEGMENT_ADDRESS = 'fakeSegmentAddress';

  // test output
  const RESPONSE_CREATE_SEGMENT = 'fakeCreateSegmentResponse';
  const RESPONSE_GET_NAME = 'fakeGetNameResponse';
  const RESPONSE_GET_SEGMENT = 'fakeGetSegmentResponse';
  const RESPONSE_GET_NUMBER_OF_SEGMENTS = 5;
  const RESPONSE_IS_SEGMENT_IN_CONTAINER = true;

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);
  const CONTAINER_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';

  beforeEach(async () => {
    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const fakeContract = new WEB3.eth.Contract(containerAbi as AbiItem[], CONTAINER_ADDRESS);
    const fakeContractMethods = fakeContract.methods;

    fakeBlockchainConnectorService = {
      web3: WEB3,
      sendTransaction: (transaction) => {
        if (transaction._method.name == fakeContractMethods.createSegment(SEGMENT_NAME)._method.name) {
          return of(RESPONSE_CREATE_SEGMENT);
        } else {
          console.error(`Internal test error: transaction method '${transaction._method.name}' not found`);
        }
      },
      call: (transaction) => {
        switch (transaction._method.name) {
          case fakeContractMethods.getName()._method.name:
            return of(RESPONSE_GET_NAME);
          case fakeContractMethods.getSegment(SEGMENT_INDEX)._method.name:
            return of(RESPONSE_GET_SEGMENT);
          case fakeContractMethods.getNumberOfSegments()._method.name:
            return of(RESPONSE_GET_NUMBER_OF_SEGMENTS);
          case fakeContractMethods.isSegmentInContainer(SEGMENT_ADDRESS)._method.name:
            return of(RESPONSE_IS_SEGMENT_IN_CONTAINER);
          default:
            console.error(`Internal test error: query method '${transaction._method.name}' not found`);
        }
      },
    };

    fakeApiConfigService = { CONTAINER_ADDRESS: CONTAINER_ADDRESS };

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
        ContainerService,
      ],
    }).compile();
    service = module.get<ContainerService>(ContainerService);
  });

  it('should create a segment for this container', (done) => {
    service.createSegment(SEGMENT_NAME).subscribe((res) => {
      expect(res).toEqual(RESPONSE_CREATE_SEGMENT);
      done();
    });
  });

  it('should get the name of this container', (done) => {
    service.getName().subscribe((res) => {
      expect(res).toEqual(RESPONSE_GET_NAME);
      done();
    });
  });

  it('should get a specific segment', (done) => {
    service.getSegment(SEGMENT_INDEX).subscribe((res) => {
      expect(res).toEqual(RESPONSE_GET_SEGMENT);
      done();
    });
  });

  it('should get the number of segments in this container', (done) => {
    service.getNumberOfSegments().subscribe((res) => {
      expect(res).toEqual(RESPONSE_GET_NUMBER_OF_SEGMENTS);
      done();
    });
  });

  it('should contain a specific segment', (done) => {
    service.isSegmentInContainer('invalidSegmentAddress').subscribe((res) => {
      expect(res).toEqual(RESPONSE_IS_SEGMENT_IN_CONTAINER);
      done();
    });
  });
});
