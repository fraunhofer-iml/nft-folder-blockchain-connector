/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TokenRestController } from './token.controller';
import { TokenService } from './token.service';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';
import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto, TokenUpdateDto } from './dto/token.dto';
import { BlockchainService } from '../shared/blockchain.service';

// TODO-LG: add tests for error cases
describe('TokenController', () => {
  let controller: TokenRestController;
  let fakeTokenService: Partial<TokenService>;
  let fakeBlockchainService: Partial<BlockchainService>;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_REMOTE_ID = 'a1b2c3';
  const INPUT_TOKEN_MINT_DTO: TokenMintDto = new TokenMintDto(
    '',
    new TokenAssetDto('', ''),
    new TokenMetadataDto('', ''),
    '',
    '',
  );
  const INPUT_TOKEN_UPDATE_DTO: TokenUpdateDto = new TokenUpdateDto();
  INPUT_TOKEN_UPDATE_DTO.assetUri = 'au';
  INPUT_TOKEN_UPDATE_DTO.assetHash = 'ah';
  INPUT_TOKEN_UPDATE_DTO.metadataUri = 'mu';
  INPUT_TOKEN_UPDATE_DTO.metadataHash = 'mh';
  INPUT_TOKEN_UPDATE_DTO.additionalInformation = 'ai';

  // test output
  const OUTPUT_MINT_TOKEN: any = {};
  const OUTPUT_GET_TOKEN: TokenGetDto = new TokenGetDto(
    '',
    new TokenAssetDto('', ''),
    new TokenMetadataDto('', ''),
    '',
    '',
    '',
    '',
    '',
    0,
    '',
  );
  const OUTPUT_GET_SEGMENTS: SegmentReadDto[] = [];
  const OUTPUT_BURN_TOKEN: any = {};
  const OUTPUT_TRANSFER_TOKEN: any = {};

  beforeEach(async () => {
    fakeTokenService = {
      mintToken: () => of(OUTPUT_MINT_TOKEN),
      getTokenByTokenId: () => of(OUTPUT_GET_TOKEN),
      getAllSegments: () => of(OUTPUT_GET_SEGMENTS),
      burnToken: () => of(OUTPUT_BURN_TOKEN),
      updateToken: () => of(OUTPUT_TRANSFER_TOKEN),
    };
    fakeBlockchainService = {
      handleError: () => null,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: fakeTokenService,
        },
        {
          provide: BlockchainService,
          useValue: fakeBlockchainService,
        },
      ],
      controllers: [TokenRestController],
    }).compile();

    controller = module.get<TokenRestController>(TokenRestController);
  });

  it('should mint a new token', (done) => {
    controller.mintToken(INPUT_TOKEN_MINT_DTO).subscribe((res) => {
      expect(res).toEqual(OUTPUT_MINT_TOKEN);
      done();
    });
  });

  it('should get a token', (done) => {
    controller.getToken(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_TOKEN);
      done();
    });
  });

  it('should get all segments for the token', (done) => {
    controller.getAllSegments(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENTS);
      done();
    });
  });

  it('should burn an existing token', (done) => {
    controller.burnToken(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_BURN_TOKEN);
      done();
    });
  });

  it('should transfer a token from the current owner to a new owner', (done) => {
    controller.updateToken(INPUT_REMOTE_ID, INPUT_TOKEN_UPDATE_DTO).subscribe((res) => {
      expect(res).toEqual(OUTPUT_TRANSFER_TOKEN);
      done();
    });
  });
});
