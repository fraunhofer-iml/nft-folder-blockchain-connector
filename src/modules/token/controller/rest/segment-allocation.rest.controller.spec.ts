/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SegmentAllocationRestController } from './segment-allocation.rest.controller';
import { SegmentAllocationService } from '../../service/segment-allocation.service';
import { ErrorDto } from '../../../../dto/error.dto';

describe('SegmentAllocationRestController', () => {
  let controller: SegmentAllocationRestController;
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
      controllers: [SegmentAllocationRestController],
    }).compile();

    controller = module.get<SegmentAllocationRestController>(SegmentAllocationRestController);
  });

  it('should get all segments for the token', (done) => {
    controller.getSegments(VALID_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENTS);
      done();
    });
  });

  it('should not get segments for this token, but return an error', (done) => {
    controller.getSegments(INVALID_TOKEN_ID).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get a segment for this token', (done) => {
    controller.getSegment(VALID_TOKEN_ID, VALID_SEGMENT_INDEX).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENT);
      done();
    });
  });

  it('should not get a segment for this token, but return an error', (done) => {
    controller.getSegment(INVALID_TOKEN_ID, INVALID_SEGMENT_INDEX).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the number of segments for this token', (done) => {
    controller.getNumberOfSegments(VALID_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_NUMBER_OF_SEGMENTS);
      done();
    });
  });

  it('should not get the number of segments for this token, but return an error', (done) => {
    controller.getNumberOfSegments(INVALID_TOKEN_ID).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should contain the token in the segment', (done) => {
    controller.isTokenInSegment(VALID_TOKEN_ID, VALID_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_IS_TOKEN_IN_SEGMENT);
      done();
    });
  });

  it('should not contain the token in the segment, but return an error', (done) => {
    controller.isTokenInSegment(INVALID_TOKEN_ID, INVALID_SEGMENT_ADDRESS).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });
});
