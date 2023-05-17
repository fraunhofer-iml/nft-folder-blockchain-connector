/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import { Observable, of } from 'rxjs';
import { AbiItem } from 'web3-utils';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';
import Web3 from 'web3';

import { SegmentService } from './segment.service';
import { BlockchainService } from '../../blockchain/service/blockchain.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { areMethodsEqual } from '../../utils/test.utils';
import { SegmentAbi } from '../../../abi/segment.abi';
import { ContainerAbi } from '../../../abi/container.abi';
import { GetSegmentDto } from '../../../dto/getSegment.dto';

describe('SegmentService', () => {
  let service: SegmentService;
  let fakeBlockchainService: Partial<BlockchainService>;
  let fakeApiConfigService: Partial<ApiConfigService>;

  // test input
  const INPUT_SEGMENT_NAME = 'inputSegmentName';
  const INPUT_TOKEN_ADDRESS = 'inputTokenAddress';
  const INPUT_TOKEN_ID = 12;
  const INPUT_SEGMENT_INDEX = 1;

  // test output
  const OUTPUT_CREATE_SEGMENT: any = {};
  const OUTPUT_GET_ALL_SEGMENTS = 'outputGetAllSegments';
  const OUTPUT_GET_SEGMENT: GetSegmentDto = new GetSegmentDto('', '', []);
  const OUTPUT_ADD_TOKEN: any = {};
  const OUTPUT_REMOVE_TOKEN: any = {};

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);
  const CONTAINER_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const SEGMENT_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';

  beforeEach(async () => {
    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const containerContract = new WEB3.eth.Contract(ContainerAbi as AbiItem[], CONTAINER_ADDRESS);
    const containerContractMethods = containerContract.methods;

    const segmentContract = new WEB3.eth.Contract(SegmentAbi as AbiItem[], SEGMENT_ADDRESS);
    const segmentContractMethods = segmentContract.methods;

    fakeBlockchainService = {
      web3: WEB3,
      sendTransaction: (transaction: TransactionObject<any>): Observable<TransactionReceipt> => {
        if (areMethodsEqual(transaction, containerContractMethods.createSegment(INPUT_SEGMENT_NAME))) {
          return of(OUTPUT_CREATE_SEGMENT);
        } else if (
          areMethodsEqual(
            transaction,
            segmentContractMethods.addToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID),
          )
        ) {
          return of(OUTPUT_ADD_TOKEN);
        } else if (
          areMethodsEqual(
            transaction,
            segmentContractMethods.removeToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID),
          )
        ) {
          return of(OUTPUT_REMOVE_TOKEN);
        }
      },
      call: (transaction: any): Observable<any> => {
        if (areMethodsEqual(transaction, containerContractMethods.getAllSegments())) {
          return of(OUTPUT_GET_ALL_SEGMENTS);
        } else if (areMethodsEqual(transaction, containerContractMethods.getSegment(INPUT_SEGMENT_INDEX))) {
          return of(OUTPUT_GET_SEGMENT);
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

  it('should create a segment', (done) => {
    service.createSegment(INPUT_SEGMENT_NAME).subscribe((res) => {
      expect(res).toEqual(OUTPUT_CREATE_SEGMENT);
      done();
    });
  });

  /* TODO-MP: this test fails due to pipe calls
it('should get all segments', (done) => {
  service.getAllSegments().subscribe((res) => {
    // expect(res).toEqual(OUTPUT_GET_ALL_SEGMENTS);
    done();
  });
});
 */

  /* TODO-MP: this test fails due to pipe calls
it('should get a specific segment', (done) => {
  service.getSegment(SEGMENT_INDEX).subscribe((res) => {
    expect(res).toEqual(OUTPUT_GET_SEGMENT);
    done();
  });
});
 */

  /* TODO-MP: this test fails due to pipe calls
  it('should add a token to a segment', (done) => {
    service.addToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_ADD_TOKEN);
      done();
    });
  });
 */

  /* TODO-MP: this test fails due to pipe calls
  it('should remove a token from a segment', (done) => {
    service.removeToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_REMOVE_TOKEN);
      done();
    });
  });
   */
});
