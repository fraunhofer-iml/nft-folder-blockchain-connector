/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SegmentAmqpController } from './segment.amqp.controller';
import { SegmentService } from '../../service/segment.service';
import { TokenDto } from '../../../../dto/token.dto';
import { ErrorDto } from '../../../../dto/error.dto';

describe('SegmentAmqpController', () => {
  let controller: SegmentAmqpController;
  let fakeService: Partial<SegmentService>;

  // test input
  const VALID_TOKEN_ADDRESS = '0x1';
  const VALID_TOKEN_ID = 2223932;
  const VALID_SEGMENT_ADDRESS = '0x2';
  const VALID_TOKEN = new TokenDto(VALID_TOKEN_ADDRESS, VALID_TOKEN_ID, VALID_SEGMENT_ADDRESS);
  const VALID_TOKEN_INDEX = 5;

  const INVALID_TOKEN_ADDRESS = 'invalidTokenAddress';
  const INVALID_TOKEN_ID = -1;
  const INVALID_SEGMENT_ADDRESS = 'invalidSegmentAddress';
  const INVALID_TOKEN = new TokenDto(INVALID_TOKEN_ADDRESS, INVALID_TOKEN_ID, INVALID_SEGMENT_ADDRESS);
  const INVALID_TOKEN_INDEX = -2;

  // test output
  const OUTPUT_ADD_TOKEN = 'outputAddToken';
  const OUTPUT_REMOVE_TOKEN = 'outputRemoveToken';
  const OUTPUT_GET_NAME = 'outputGetName';
  const OUTPUT_GET_CONTAINER = 'outputGetContainer';
  const OUTPUT_GET_ALL_TOKEN_INFORMATION = 'outputGetAllTokenInformation';
  const OUTPUT_GET_TOKEN_INFORMATION = 'outputGetTokenInformation';
  const OUTPUT_GET_NUMBER_OF_TOKEN_INFORMATION = 5;
  const OUTPUT_IS_TOKEN_IN_SEGMENT = true;
  const ERROR = new ErrorDto(400, 'This is an error message');

  beforeEach(async () => {
    fakeService = {
      addToken: (tokenAddress: string, tokenId: number, segmentAddress: string) =>
        tokenAddress == VALID_TOKEN_ADDRESS && tokenId == VALID_TOKEN_ID && segmentAddress == VALID_SEGMENT_ADDRESS
          ? of(OUTPUT_ADD_TOKEN)
          : of(ERROR),
      removeToken: (tokenAddress: string, tokenId: number, segmentAddress: string) =>
        tokenAddress == VALID_TOKEN_ADDRESS && tokenId == VALID_TOKEN_ID && segmentAddress == VALID_SEGMENT_ADDRESS
          ? of(OUTPUT_REMOVE_TOKEN)
          : of(ERROR),
      getName: (segmentAddress: string) => (segmentAddress == VALID_SEGMENT_ADDRESS ? of(OUTPUT_GET_NAME) : of(ERROR)),
      getContainer: (segmentAddress: string) =>
        segmentAddress == VALID_SEGMENT_ADDRESS ? of(OUTPUT_GET_CONTAINER) : of(ERROR),
      getAllTokenInformation: (segmentAddress: string) =>
        segmentAddress == VALID_SEGMENT_ADDRESS ? of(OUTPUT_GET_ALL_TOKEN_INFORMATION) : of(ERROR),
      getTokenInformation: (segmentAddress: string, index: number) =>
        segmentAddress == VALID_SEGMENT_ADDRESS && index == VALID_TOKEN_INDEX
          ? of(OUTPUT_GET_TOKEN_INFORMATION)
          : of(ERROR),
      getNumberOfTokenInformation: (segmentAddress: string) =>
        segmentAddress == VALID_SEGMENT_ADDRESS ? of(OUTPUT_GET_NUMBER_OF_TOKEN_INFORMATION) : of(ERROR),
      isTokenInSegment: (tokenAddress: string, tokenId: number, segmentAddress: string) =>
        tokenAddress == VALID_TOKEN_ADDRESS && tokenId == VALID_TOKEN_ID && segmentAddress == VALID_SEGMENT_ADDRESS
          ? of(OUTPUT_IS_TOKEN_IN_SEGMENT)
          : of(ERROR),
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

  it('should add a token', (done) => {
    controller.addToken(VALID_TOKEN).subscribe((res) => {
      expect(res).toEqual(OUTPUT_ADD_TOKEN);
      done();
    });
  });

  it('should not add a token, but return an error', (done) => {
    controller.addToken(INVALID_TOKEN).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should remove a token', (done) => {
    controller.removeToken(VALID_TOKEN).subscribe((res) => {
      expect(res).toEqual(OUTPUT_REMOVE_TOKEN);
      done();
    });
  });

  it('should not remove a token, but return an error', (done) => {
    controller.removeToken(INVALID_TOKEN).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the segment name', (done) => {
    controller.getName({ segmentAddress: VALID_SEGMENT_ADDRESS }).subscribe((response) => {
      expect(response).toEqual(OUTPUT_GET_NAME);
      done();
    });
  });

  it('should not get the segment name, but return an error', (done) => {
    controller.getName({ segmentAddress: INVALID_SEGMENT_ADDRESS }).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the container', (done) => {
    controller.getContainer({ segmentAddress: VALID_SEGMENT_ADDRESS }).subscribe((response) => {
      expect(response).toEqual(OUTPUT_GET_CONTAINER);
      done();
    });
  });

  it('should not get the container, but return an error', (done) => {
    controller.getContainer({ segmentAddress: INVALID_SEGMENT_ADDRESS }).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get all token information', (done) => {
    controller.getAllTokenInformation({ segmentAddress: VALID_SEGMENT_ADDRESS }).subscribe((response) => {
      expect(response).toEqual(OUTPUT_GET_ALL_TOKEN_INFORMATION);
      done();
    });
  });

  it('should not get all token information, but return an error', (done) => {
    controller.getAllTokenInformation({ segmentAddress: INVALID_SEGMENT_ADDRESS }).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the token information', (done) => {
    controller
      .getTokenInformation({ segmentAddress: VALID_SEGMENT_ADDRESS, index: VALID_TOKEN_INDEX })
      .subscribe((response) => {
        expect(response).toEqual(OUTPUT_GET_TOKEN_INFORMATION);
        done();
      });
  });

  it('should not get the token information, but return an error', (done) => {
    controller.getTokenInformation({ segmentAddress: INVALID_SEGMENT_ADDRESS, index: INVALID_TOKEN_INDEX }).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should get the number of token information', (done) => {
    controller.getNumberOfTokenInformation({ segmentAddress: VALID_SEGMENT_ADDRESS }).subscribe((response) => {
      expect(response).toEqual(OUTPUT_GET_NUMBER_OF_TOKEN_INFORMATION);
      done();
    });
  });

  it('should not get the number of token information, but return an error', (done) => {
    controller.getNumberOfTokenInformation({ segmentAddress: INVALID_SEGMENT_ADDRESS }).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });

  it('should contain a token in the segment', (done) => {
    controller.isTokenInSegment(VALID_TOKEN).subscribe((response) => {
      expect(response).toEqual(OUTPUT_IS_TOKEN_IN_SEGMENT);
      done();
    });
  });

  it('should not contain a token in the segment, but return an error', (done) => {
    controller.isTokenInSegment(INVALID_TOKEN).subscribe(
      (data) => console.log(data),
      (err) => {
        expect(err).toEqual(new BadRequestException(ERROR.errorMessage));
        done();
      },
      () => '',
    );
  });
});
