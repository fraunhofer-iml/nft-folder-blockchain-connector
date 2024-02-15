/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { TokenService } from './token.service';
import { BlockchainService } from '../shared/blockchain.service';
import { SegmentService } from '../segment/segment.service';
import { EventService, TokenInformation } from './event.service';
import { ApiConfigService } from '../config/api.config.service';
import { areMethodsEqual } from '../shared/test.utils';

import { SegmentReadDto } from '../segment/dto/segment.read.dto';
import {
  TokenAssetDto,
  TokenContractInfoDto,
  TokenGetDto,
  TokenMetadataDto,
  TokenMintDto,
  TokenUpdateDto,
} from './dto/token.dto';
import { TokenAbi } from './abi/token.abi';

describe('TokenService', () => {
  let service: TokenService;
  let mockedBlockchainService: Partial<BlockchainService>;
  let mockedApiConfigService: Partial<ApiConfigService>;
  let mockedEventInformationService: Partial<EventService>;
  let mockedSegmentService: Partial<SegmentService>;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_REMOTE_ID = 'testRemoteId';
  const INPUT_TOKEN_ADDRESS = '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83';
  const INPUT_TOKEN_SENDER = '0xe168326f1f10da12bbc838D9BB9d0B6241Fd518d';
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
    new TokenAssetDto('test asset uri', 'testHash'),
    new TokenMetadataDto('test meta uri', 'testHash'),
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
  TOKEN_UPDATE_DTO.assetHash = 'testHash';
  TOKEN_UPDATE_DTO.metadataUri = 'test meta uri';
  TOKEN_UPDATE_DTO.metadataHash = 'testHash';
  TOKEN_UPDATE_DTO.additionalInformation = 'test additional information';

  // test output
  const OUTPUT_MINT_TOKEN: any = {};
  const OUTPUT_SEGMENT = new SegmentReadDto('0x1f7b7F7F6A0a32496eE805b6532f686E40568D83', 'testSegmentName', [
    new TokenContractInfoDto(INPUT_TOKEN_ADDRESS, INPUT_TOKEN_ID.toString()),
  ]);
  const OUTPUT_GET_SEGMENTS: SegmentReadDto[] = [OUTPUT_SEGMENT];
  const OUTPUT_BURN_TOKEN: any = {};
  const OUTPUT_TRANSFER_TOKEN: any = {};
  const TOKEN_UPDATED_RESPONSE = 'token updated';

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);

  beforeEach(async () => {
    mockedApiConfigService = {
      TOKEN_ADDRESS: INPUT_TOKEN_ADDRESS,
    };

    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const contract = new WEB3.eth.Contract(TokenAbi as AbiItem[], INPUT_TOKEN_ADDRESS);
    const contractMethods = contract.methods;

    mockedBlockchainService = {
      web3: WEB3,
      sendTransaction: (transactionObject) => {
        if (
          areMethodsEqual(
            transactionObject,
            contractMethods.safeMint(
              INPUT_TOKEN_MINT_DTO.ownerAddress,
              INPUT_TOKEN_MINT_DTO.asset.uri,
              INPUT_TOKEN_MINT_DTO.asset.hash,
              INPUT_TOKEN_MINT_DTO.metadata.uri,
              INPUT_TOKEN_MINT_DTO.metadata.hash,
              INPUT_TOKEN_MINT_DTO.remoteId,
              INPUT_TOKEN_MINT_DTO.additionalInformation,
            ),
          )
        ) {
          return Promise.resolve(OUTPUT_MINT_TOKEN);
        } else if (areMethodsEqual(transactionObject, contractMethods.burn(INPUT_TOKEN_ID))) {
          return Promise.resolve(OUTPUT_BURN_TOKEN);
        } else if (
          areMethodsEqual(
            transactionObject,
            contractMethods.safeTransferFrom(INPUT_TOKEN_RECEIVER, INPUT_TOKEN_SENDER, INPUT_TOKEN_ID),
          )
        ) {
          return Promise.resolve(OUTPUT_TRANSFER_TOKEN);
        } else if (
          areMethodsEqual(
            transactionObject,
            contractMethods.updateToken(
              INPUT_TOKEN_ID,
              TOKEN_UPDATE_DTO.assetUri,
              TOKEN_UPDATE_DTO.assetHash,
              TOKEN_UPDATE_DTO.metadataUri,
              TOKEN_UPDATE_DTO.metadataHash,
              TOKEN_UPDATE_DTO.additionalInformation,
            ),
          )
        ) {
          return Promise.resolve(TOKEN_UPDATED_RESPONSE);
        } else {
          return Promise.reject('');
        }
      },

      call: (transaction) => {
        if (areMethodsEqual(transaction, contractMethods.getTokenId(INPUT_REMOTE_ID))) {
          return Promise.resolve(INPUT_TOKEN_ID);
        } else if (areMethodsEqual(transaction, contractMethods.ownerOf(INPUT_TOKEN_ID))) {
          return Promise.resolve(TOKEN_GET_DTO.ownerAddress);
        } else if (areMethodsEqual(transaction, contractMethods.getToken(INPUT_TOKEN_ID))) {
          return Promise.resolve({
            assetUri: TOKEN_GET_DTO.asset.uri,
            assetHash: TOKEN_GET_DTO.asset.hash,
            metadataUri: TOKEN_GET_DTO.metadata.uri,
            metadataHash: TOKEN_GET_DTO.metadata.hash,
            additionalInformation: TOKEN_GET_DTO.additionalInformation,
          });
        } else if (areMethodsEqual(transaction, contractMethods.getRemoteId(INPUT_TOKEN_ID))) {
          return Promise.resolve(TOKEN_GET_DTO.remoteId);
        } else {
          return Promise.reject('');
        }
      },
      derivePublicAddressFromPrivateKey(): any {
        return INPUT_TOKEN_MINT_DTO.ownerAddress;
      },
    };

    mockedSegmentService = {
      fetchAllSegments(): any {
        return Promise.resolve(OUTPUT_GET_SEGMENTS);
      },
    };

    mockedEventInformationService = {
      fetchTokenInformation(tokenId): Promise<TokenInformation> {
        if (INPUT_TOKEN_ID == tokenId) {
          return Promise.resolve(TOKEN_GET_DTO);
        } else {
          return Promise.reject('');
        }
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainService,
          useValue: mockedBlockchainService,
        },
        {
          provide: ApiConfigService,
          useValue: mockedApiConfigService,
        },
        {
          provide: EventService,
          useValue: mockedEventInformationService,
        },
        TokenService,
        {
          provide: SegmentService,
          useValue: mockedSegmentService,
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
