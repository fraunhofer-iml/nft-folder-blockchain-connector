/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';

import { SegmentController } from './segment.controller';
import { SegmentService } from './segment.service';
import { SegmentReadDto } from './dto/segment.read.dto';
import { TokenContractInfoDto } from '../token/dto/token.dto';

describe('SegmentRestController', () => {
  let controller: SegmentController;
  let mockedService: Partial<SegmentService>;

  // test input
  const INPUT_SEGMENT_NAME = 'inputSegmentName';
  const INPUT_TOKEN_ADDRESS = 'testTokenAddress1';
  const INPUT_TOKEN_ID = '2223932';
  const INPUT_SEGMENT_INDEX = 1;
  const INPUT_TOKEN = new TokenContractInfoDto(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID);

  // test output
  const OUTPUT_CREATE_SEGMENT_RESPONSE: any = {};
  const OUTPUT_GET_ALL_SEGMENTS: SegmentReadDto[] = [];
  const OUTPUT_GET_SEGMENT_RESPONSE: SegmentReadDto = new SegmentReadDto('', '', []);
  const OUTPUT_ADD_TOKEN: any = {};
  const OUTPUT_REMOVE_TOKEN: any = {};

  beforeEach(async () => {
    mockedService = {
      createSegment: () => Promise.resolve(OUTPUT_CREATE_SEGMENT_RESPONSE),
      fetchAllSegments: () => Promise.resolve(OUTPUT_GET_ALL_SEGMENTS),
      fetchSegment: () => Promise.resolve(OUTPUT_GET_SEGMENT_RESPONSE),
      addToken: () => Promise.resolve(OUTPUT_ADD_TOKEN),
      removeToken: () => Promise.resolve(OUTPUT_REMOVE_TOKEN),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SegmentService,
          useValue: mockedService,
        },
      ],
      controllers: [SegmentController],
    }).compile();

    controller = module.get<SegmentController>(SegmentController);
  });

  it('should create a segment for this container', async () => {
    expect(await controller.createSegment({ name: INPUT_SEGMENT_NAME })).toEqual(OUTPUT_CREATE_SEGMENT_RESPONSE);
  });

  it('should get all segments of this container', async () => {
    expect(await controller.getAllSegments()).toEqual(OUTPUT_GET_ALL_SEGMENTS);
  });

  it('should get a specific segment', async () => {
    expect(await controller.getSegment(INPUT_SEGMENT_INDEX)).toEqual(OUTPUT_GET_SEGMENT_RESPONSE);
  });

  it('should add a token', async () => {
    expect(await controller.addToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN)).toEqual(OUTPUT_ADD_TOKEN);
  });

  it('should remove a token', async () => {
    expect(await controller.removeToken(INPUT_SEGMENT_INDEX, INPUT_TOKEN)).toEqual(OUTPUT_REMOVE_TOKEN);
  });
});
