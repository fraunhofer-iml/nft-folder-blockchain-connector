/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SegmentAllocationAmqpController } from './segment-allocation.amqp.controller';
import { SegmentAllocationService } from '../../service/segment-allocation.service';
import { ErrorDto } from '../../../../dto/error.dto';

describe('SegmentAllocationAmqpController', () => {
  let controller: SegmentAllocationAmqpController;
  let fakeService: Partial<SegmentAllocationService>;

  //test input
  const VALID_TOKEN_ID = 10;
  const VALID_SEGMENT_INDEX = 5;
  const VALID_SEGMENT_ADDRESS = 'validSegmentAddress';

  const INVALID_TOKEN_ID = -1;
  const INVALID_SEGMENT_INDEX = -2;
  const INVALID_SEGMENT_ADDRESS = 'invalidSegmentAddress';

  //test output
  const OUTPUT_GET_SEGMENTS = 'outputGetSegments';
  const OUTPUT_GET_SEGMENT = 'outputGetSegment';
  const OUTPUT_GET_NUMBER_OF_SEGMENTS = 5;
  const OUTPUT_IS_TOKEN_IN_SEGMENT = true;
  const ERROR = new ErrorDto(400, 'This is an error');

  beforeEach(async () => {
    fakeService = {
      getSegments: (tokenId) => (tokenId == VALID_TOKEN_ID ? of(OUTPUT_GET_SEGMENTS) : of(ERROR)),
      getSegment: (tokenId, segmentAddressIndex) =>
        tokenId == VALID_TOKEN_ID && segmentAddressIndex == VALID_SEGMENT_INDEX ? of(OUTPUT_GET_SEGMENT) : of(ERROR),
      getNumberOfSegments: (tokenId) => (tokenId == VALID_TOKEN_ID ? of(OUTPUT_GET_NUMBER_OF_SEGMENTS) : of(ERROR)),
      isTokenInSegment: (tokenId, segmentAddress) =>
        tokenId == VALID_TOKEN_ID && segmentAddress == VALID_SEGMENT_ADDRESS
          ? of(OUTPUT_IS_TOKEN_IN_SEGMENT)
          : of(ERROR),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SegmentAllocationService,
          useValue: fakeService,
        },
      ],
      controllers: [SegmentAllocationAmqpController],
    }).compile();

    controller = module.get<SegmentAllocationAmqpController>(SegmentAllocationAmqpController);
  });

  it('should get all segments for the token', (done) => {
    controller
      .getSegments({
        tokenId: VALID_TOKEN_ID,
      })
      .subscribe((res) => {
        expect(res).toEqual(OUTPUT_GET_SEGMENTS);
        done();
      });
  });

  it('should not get segments for this token, but return an error', (done) => {
    controller
      .getSegments({
        tokenId: INVALID_TOKEN_ID,
      })
      .subscribe(
        (data) => console.log(data),
        (err) => {
          expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
          done();
        },
        () => '',
      );
  });

  it('should get a segment for this token', (done) => {
    controller
      .getSegment({
        tokenId: VALID_TOKEN_ID,
        segmentAddressIndex: VALID_SEGMENT_INDEX,
      })
      .subscribe((res) => {
        expect(res).toEqual(OUTPUT_GET_SEGMENT);
        done();
      });
  });

  it('should not get a segment for this token, but return an error', (done) => {
    controller
      .getSegment({
        tokenId: INVALID_TOKEN_ID,
        segmentAddressIndex: INVALID_SEGMENT_INDEX,
      })
      .subscribe(
        (data) => console.log(data),
        (err) => {
          expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
          done();
        },
        () => '',
      );
  });

  it('should get the number of segments for this token', (done) => {
    controller
      .getNumberOfSegments({
        tokenId: VALID_TOKEN_ID,
      })
      .subscribe((res) => {
        expect(res).toEqual(OUTPUT_GET_NUMBER_OF_SEGMENTS);
        done();
      });
  });

  it('should not get the number of segments for this token, but return an error', (done) => {
    controller
      .getNumberOfSegments({
        tokenId: INVALID_TOKEN_ID,
      })
      .subscribe(
        (data) => console.log(data),
        (err) => {
          expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
          done();
        },
        () => '',
      );
  });

  it('should contain the token in the segment', (done) => {
    controller
      .isTokenInSegment({
        tokenId: VALID_TOKEN_ID,
        segmentAddress: VALID_SEGMENT_ADDRESS,
      })
      .subscribe((res) => {
        expect(res).toEqual(OUTPUT_IS_TOKEN_IN_SEGMENT);
        done();
      });
  });

  it('should not contain the token in the segment, but return an error', (done) => {
    controller
      .isTokenInSegment({
        tokenId: INVALID_TOKEN_ID,
        segmentAddress: INVALID_SEGMENT_ADDRESS,
      })
      .subscribe(
        (data) => console.log(data),
        (err) => {
          expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
          done();
        },
        () => '',
      );
  });
});
