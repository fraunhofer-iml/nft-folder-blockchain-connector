/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';

import { TokenRestController } from './token.controller';
import { TokenService } from './token.service';
import { BlockchainService } from '../shared/blockchain.service';

import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto, TokenUpdateDto } from './dto/token.dto';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';

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
      mintToken: () => Promise.resolve(OUTPUT_MINT_TOKEN),
      getTokenByTokenId: () => Promise.resolve(OUTPUT_GET_TOKEN),
      getTokenByRemoteId: () => Promise.resolve(OUTPUT_GET_TOKEN),
      getAllSegments: () => Promise.resolve(OUTPUT_GET_SEGMENTS),
      burnToken: () => Promise.resolve(OUTPUT_BURN_TOKEN),
      updateToken: () => Promise.resolve(OUTPUT_TRANSFER_TOKEN),
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

  it('should get a token for a token id', async () => {
    expect(await controller.getToken(INPUT_TOKEN_ID)).toEqual(OUTPUT_GET_TOKEN);
  });

  it('should get a token for a remote id', async () => {
    expect(await controller.getToken(undefined, INPUT_REMOTE_ID)).toEqual(OUTPUT_GET_TOKEN);
  });

  it('should not get a token', async () => {
    controller
      .getToken(undefined, undefined)
      .catch((reason) => expect(reason).toEqual({ message: 'Neither a tokenId nor a remoteId was specified' }));
  });

  it('should get all segments for the token', async () => {
    expect(await controller.getAllSegments(INPUT_TOKEN_ID)).toEqual(OUTPUT_GET_SEGMENTS);
  });

  it('should mint a new token', async () => {
    expect(await controller.mintToken(INPUT_TOKEN_MINT_DTO)).toEqual(OUTPUT_MINT_TOKEN);
  });

  it('should transfer a token from the current owner to a new owner', async () => {
    expect(await controller.updateToken(INPUT_REMOTE_ID, INPUT_TOKEN_UPDATE_DTO)).toEqual(OUTPUT_TRANSFER_TOKEN);
  });

  it('should burn an existing token', async () => {
    expect(await controller.burnToken(INPUT_TOKEN_ID)).toEqual(OUTPUT_BURN_TOKEN);
  });
});
