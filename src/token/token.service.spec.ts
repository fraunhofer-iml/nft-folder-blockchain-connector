/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';

import { TokenService } from './token.service';
import { BlockchainService } from '../shared/blockchain.service';
import { SegmentService } from '../segment/segment.service';
import { EventService, TokenInformation } from './event.service';
import { ApiConfigService } from '../config/api.config.service';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';
import {
  TokenAssetDto,
  TokenInformationDto,
  TokenGetDto,
  TokenMetadataDto,
  TokenMintDto,
  TokenUpdateDto,
} from './dto/token.dto';

describe('TokenService', () => {
  let service: TokenService;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_REMOTE_ID = 'testRemoteId';
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const INPUT_TOKEN_RECEIVER = '0xe168326f1f10da12bbc838D9BB9d0B6241Fd518d';
  const INPUT_TOKEN_MINT_DTO: TokenMintDto = new TokenMintDto(
    INPUT_TOKEN_RECEIVER,
    new TokenAssetDto('', ''),
    new TokenMetadataDto('', ''),
    '',
    '',
  );
  const TOKEN_GET_DTO = new TokenGetDto(
    INPUT_REMOTE_ID,
    new TokenAssetDto('test asset uri', 'test hash'),
    new TokenMetadataDto('test meta uri', 'test hash'),
    'test additional information',
    'test owner address',
    'test minter address',
    'test created on',
    'test last updated on',
    INPUT_TOKEN_ID,
    INPUT_TOKEN_ADDRESS,
  );
  const TOKEN_UPDATE_DTO = new TokenUpdateDto();
  TOKEN_UPDATE_DTO.assetUri = 'test asset uri';
  TOKEN_UPDATE_DTO.assetHash = 'test hash';
  TOKEN_UPDATE_DTO.metadataUri = 'test meta uri';
  TOKEN_UPDATE_DTO.metadataHash = 'test hash';
  TOKEN_UPDATE_DTO.additionalInformation = 'test additional information';

  // test output
  const OUTPUT_MINT_TOKEN: any = {};
  const OUTPUT_SEGMENT = new SegmentReadDto('0x1f7b7F7F6A0a32496eE805b6532f686E40568D83', 'testSegmentName', [
    new TokenInformationDto(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID.toString()),
  ]);
  const OUTPUT_GET_SEGMENTS: SegmentReadDto[] = [OUTPUT_SEGMENT];
  const OUTPUT_BURN_TOKEN: any = {};
  const OUTPUT_TRANSFER_TOKEN: any = {};
  const TOKEN_UPDATED_RESPONSE = 'token updated';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: EventService,
          useValue: {
            fetchTokenInformation(tokenId): Promise<TokenInformation> {
              if (INPUT_TOKEN_ID == tokenId) {
                return Promise.resolve(TOKEN_GET_DTO);
              } else {
                return Promise.reject('');
              }
            },
          },
        },
        {
          provide: SegmentService,
          useValue: {
            fetchAllSegments(): any {
              return Promise.resolve(OUTPUT_GET_SEGMENTS);
            },
          },
        },
        {
          provide: BlockchainService,
          useValue: {
            provider: ethers.getDefaultProvider(),
            getContract() {
              return {
                safeMint: jest.fn().mockImplementation(() => {
                  return Promise.resolve(OUTPUT_MINT_TOKEN);
                }),
                burn: jest.fn().mockImplementation(() => {
                  return Promise.resolve(OUTPUT_BURN_TOKEN);
                }),
                safeTransferFrom: jest.fn().mockImplementation(() => {
                  return Promise.resolve(OUTPUT_TRANSFER_TOKEN);
                }),
                updateToken: jest.fn().mockImplementation(() => {
                  return Promise.resolve(TOKEN_UPDATED_RESPONSE);
                }),
                getTokenId: jest.fn().mockImplementation(() => {
                  return Promise.resolve(INPUT_TOKEN_ID);
                }),
                ownerOf: jest.fn().mockImplementation(() => {
                  return Promise.resolve(TOKEN_GET_DTO.ownerAddress);
                }),
                getToken: jest.fn().mockImplementation(() => {
                  return Promise.resolve({
                    assetUri: TOKEN_GET_DTO.asset.uri,
                    assetHash: TOKEN_GET_DTO.asset.hash,
                    metadataUri: TOKEN_GET_DTO.metadata.uri,
                    metadataHash: TOKEN_GET_DTO.metadata.hash,
                    additionalInformation: TOKEN_GET_DTO.additionalInformation,
                  });
                }),
                getRemoteId: jest.fn().mockImplementation(() => {
                  return Promise.resolve(TOKEN_GET_DTO.remoteId);
                }),
              };
            },
            returnSignerAddress(): string {
              return '';
            },
          },
        },
        {
          provide: ApiConfigService,
          useValue: {
            TOKEN_ADDRESS: INPUT_TOKEN_ADDRESS,
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should get a token from a remoteId', async () => {
    expect(await service.getTokenByRemoteId(INPUT_REMOTE_ID)).toEqual(TOKEN_GET_DTO);
  });

  it('should get a token id from a remoteId', async () => {
    expect(await service.getTokenByTokenId(INPUT_TOKEN_ID)).toEqual(TOKEN_GET_DTO);
  });

  it('should get all segments for the token', async () => {
    expect(await service.getAllSegments(INPUT_TOKEN_ID)).toEqual(OUTPUT_GET_SEGMENTS);
  });

  it('should mint a new token', async () => {
    expect(await service.mintToken(INPUT_TOKEN_MINT_DTO)).toEqual(OUTPUT_MINT_TOKEN);
  });

  it('should update a token', async () => {
    expect(await service.updateToken(INPUT_REMOTE_ID, TOKEN_UPDATE_DTO)).toEqual(TOKEN_UPDATED_RESPONSE);
  });

  it('should not update a token', async () => {
    service.updateToken(INPUT_REMOTE_ID, new TokenUpdateDto()).catch((reason) => expect(reason).toEqual(''));
  });

  it('should burn an existing token', async () => {
    expect(await service.burnToken(INPUT_TOKEN_ID)).toEqual(OUTPUT_BURN_TOKEN);
  });
});
