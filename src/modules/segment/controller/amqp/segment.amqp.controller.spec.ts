/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SegmentAmqpController } from './segment.amqp.controller';
import { SegmentService } from '../../service/segment.service';

import { GetSegmentDto } from '../../../../dto/getSegment.dto';

describe('SegmentAmqpController', () => {
  let controller: SegmentAmqpController;
  let fakeService: Partial<SegmentService>;

  // test input
  const INPUT_SEGMENT_NAME = 'inputSegmentName';
  const INPUT_TOKEN_ADDRESS = '0x1';
  const INPUT_TOKEN_ID = 2223932;
  const INPUT_SEGMENT_INDEX = 1;
  const INPUT_TOKEN = { index: INPUT_SEGMENT_INDEX, tokenAddress: INPUT_TOKEN_ADDRESS, tokenId: INPUT_TOKEN_ID };

  // test output
  const OUTPUT_CREATE_SEGMENT_RESPONSE: any = {};
  const OUTPUT_GET_ALL_SEGMENTS: GetSegmentDto[] = [];
  const OUTPUT_GET_SEGMENT_RESPONSE = new GetSegmentDto('', '', []);
  const OUTPUT_ADD_TOKEN: any = {};
  const OUTPUT_REMOVE_TOKEN: any = {};

  beforeEach(async () => {
    fakeService = {
      createSegment: () => of(OUTPUT_CREATE_SEGMENT_RESPONSE),
      getAllSegments: () => of(OUTPUT_GET_ALL_SEGMENTS),
      getSegment: () => of(OUTPUT_GET_SEGMENT_RESPONSE),
      addToken: () => of(OUTPUT_ADD_TOKEN),
      removeToken: () => of(OUTPUT_REMOVE_TOKEN),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SegmentService,
          useValue: fakeService,
        },
      ],
      controllers: [SegmentAmqpController],
    }).compile();

    controller = module.get<SegmentAmqpController>(SegmentAmqpController);
  });

  it('should create a segment for this container', (done) => {
    controller.createSegment({ name: INPUT_SEGMENT_NAME }).subscribe((res) => {
      expect(res).toEqual(OUTPUT_CREATE_SEGMENT_RESPONSE);
      done();
    });
  });

  it('should get the number of segments in this container', (done) => {
    controller.getAllSegments().subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_ALL_SEGMENTS);
      done();
    });
  });

  it('should get a specific segment', (done) => {
    controller.getSegment({ index: INPUT_SEGMENT_INDEX }).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENT_RESPONSE);
      done();
    });
  });

  it('should add a token', (done) => {
    controller.addToken(INPUT_TOKEN).subscribe((res) => {
      expect(res).toEqual(OUTPUT_ADD_TOKEN);
      done();
    });
  });

  it('should remove a token', (done) => {
    controller.removeToken(INPUT_TOKEN).subscribe((res) => {
      expect(res).toEqual(OUTPUT_REMOVE_TOKEN);
      done();
    });
  });
});
