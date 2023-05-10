/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { ContainerRestController } from './container.rest.controller';
import { ContainerService } from '../../service/container.service';
import { ErrorDto } from '../../../../dto/error.dto';

// TODO-MP: are these tests really necessary?
describe('ContainerRestController', () => {
  let controller: ContainerRestController;
  let fakeService: Partial<ContainerService>;

  // test input
  const INPUT_SEGMENT_NAME = 'inputSegmentName';
  const INPUT_SEGMENT_INDEX = 5;
  const INPUT_SEGMENT_ADDRESS = 'inputSegmentAddress';

  // test output
  const OUTPUT_CREATE_SEGMENT_RESPONSE = 'outputCreateSegmentResponse';
  const OUTPUT_GET_NAME_RESPONSE = 'outputGetNameResponse';
  const OUTPUT_GET_SEGMENT_RESPONSE = 'outputGetSegmentResponse';
  const OUTPUT_GET_NUMBER_OF_SEGMENTS_RESPONSE = 5;
  const OUTPUT_IS_SEGMENT_IN_CONTAINER_RESPONSE = true;

  // test error
  const OUTPUT_ERROR = new ErrorDto(400, 'This is an error');

  beforeEach(async () => {
    fakeService = {
      createSegment: (name: string) =>
        name == INPUT_SEGMENT_NAME ? of(OUTPUT_CREATE_SEGMENT_RESPONSE) : of(OUTPUT_ERROR),
      getName: () => of(OUTPUT_GET_NAME_RESPONSE),
      getNumberOfSegments: () => of(OUTPUT_GET_NUMBER_OF_SEGMENTS_RESPONSE),
      getSegment: (index) => (index == INPUT_SEGMENT_INDEX ? of(OUTPUT_GET_SEGMENT_RESPONSE) : of(OUTPUT_ERROR)),
      isSegmentInContainer: (segmentAddress) =>
        segmentAddress == INPUT_SEGMENT_ADDRESS ? of(OUTPUT_IS_SEGMENT_IN_CONTAINER_RESPONSE) : of(OUTPUT_ERROR),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ContainerService,
          useValue: fakeService,
        },
      ],
      controllers: [ContainerRestController],
    }).compile();

    controller = module.get<ContainerRestController>(ContainerRestController);
  });

  it('should create a segment for this container', (done) => {
    controller.createSegment({ name: INPUT_SEGMENT_NAME }).subscribe((res) => {
      expect(res).toEqual(OUTPUT_CREATE_SEGMENT_RESPONSE);
      done();
    });
  });

  it('should not create a segment for this container, but return an error', (done) => {
    controller.createSegment({ name: 'InvalidSegmentName' }).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(OUTPUT_ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the name of this container', (done) => {
    controller.getName().subscribe((name) => {
      expect(name).toEqual(OUTPUT_GET_NAME_RESPONSE);
      done();
    });
  });

  it('should get a specific segment', (done) => {
    controller.getSegment(INPUT_SEGMENT_INDEX).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENT_RESPONSE);
      done();
    });
  });

  it('should not get specific segment, but return an error', (done) => {
    controller.getSegment(0).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(OUTPUT_ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the number of segments in this container', (done) => {
    controller.getNumberOfSegments().subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_NUMBER_OF_SEGMENTS_RESPONSE);
      done();
    });
  });

  it('should contain a specific segment', (done) => {
    controller.isSegmentInContainer(INPUT_SEGMENT_ADDRESS).subscribe((res) => {
      expect(res).toEqual(OUTPUT_IS_SEGMENT_IN_CONTAINER_RESPONSE);
      done();
    });
  });

  it('should not contain a specific segment, but return an error', (done) => {
    controller.isSegmentInContainer('invalidSegmentAddress').subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(OUTPUT_ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });
});
