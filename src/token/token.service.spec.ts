/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { mock, resetMocks } from '@depay/web3-mock';
import { of } from 'rxjs';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { TokenService } from './token.service';
import { BlockchainService } from '../shared/blockchain.service';
import { SegmentService } from '../segment/segment.service';
import { ApiConfigService } from '../config/api.config.service';
import { areMethodsEqual } from '../shared/test.utils';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';
import { TokenAssetDto, TokenMetadataDto, TokenMintDto } from './dto/token.dto';
import { TokenAbi } from './abi/token.abi';
import { EventService } from './event.service';

describe('TokenService', () => {
  let service: TokenService;
  let fakeBlockchainService: Partial<BlockchainService>;
  let fakeApiConfigService: Partial<ApiConfigService>;
  let fakeEventInformationService: Partial<EventService>;

  // test input
  const INPUT_TOKEN_ID = '12';
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

  // test output
  const OUTPUT_MINT_TOKEN: any = {};
  const OUTPUT_GET_SEGMENTS: SegmentReadDto[] = [];
  const OUTPUT_BURN_TOKEN: any = {};
  const OUTPUT_TRANSFER_TOKEN: any = {};

  // web3 mock
  const PROVIDER = new Web3.providers.HttpProvider(global.ethereum);
  const WEB3 = new Web3(PROVIDER);

  beforeEach(async () => {
    fakeApiConfigService = {
      TOKEN_ADDRESS: INPUT_TOKEN_ADDRESS,
    };

    resetMocks();
    mock({ blockchain: 'ethereum', accounts: { return: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'] } });

    const contract = new WEB3.eth.Contract(TokenAbi as AbiItem[], INPUT_TOKEN_ADDRESS);
    const contractMethods = contract.methods;

    fakeBlockchainService = {
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
          return of(OUTPUT_MINT_TOKEN);
        } else if (areMethodsEqual(transactionObject, contractMethods.burn(INPUT_TOKEN_ID))) {
          return of(OUTPUT_BURN_TOKEN);
        } else if (
          areMethodsEqual(
            transactionObject,
            contractMethods.safeTransferFrom(INPUT_TOKEN_RECEIVER, INPUT_TOKEN_SENDER, INPUT_TOKEN_ID),
          )
        ) {
          return of(OUTPUT_TRANSFER_TOKEN);
        }
      },

      call: (transaction) => {
        if (areMethodsEqual(transaction, contractMethods.getAllSegments(INPUT_TOKEN_ID))) {
          return of(OUTPUT_GET_SEGMENTS);
        }
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainService,
          useValue: fakeBlockchainService,
        },
        {
          provide: ApiConfigService,
          useValue: fakeApiConfigService,
        },
        {
          provide: EventService,
          useValue: fakeEventInformationService,
        },
        TokenService,
        SegmentService,
      ],
    }).compile();
    service = module.get<TokenService>(TokenService);
  });

  /*
  it('should mint a new token', (done) => {
    service.mintToken(INPUT_TOKEN_MINT_DTO).subscribe((res) => {
      expect(res).toEqual(OUTPUT_MINT_TOKEN);
      done();
    });
  });
   */

  /* TODO-MP: this test fails due to pipe calls
  it('should get all segments for the token', (done) => {
    service.getAllSegments(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_GET_SEGMENTS);
      done();
    });
  });
  */

  it('should burn an existing token', (done) => {
    service.burnToken(INPUT_TOKEN_ID).subscribe((res) => {
      expect(res).toEqual(OUTPUT_BURN_TOKEN);
      done();
    });
  });

  /* TODO-MP: this test fails due to pipe calls
  it('should transfer a token from the current owner to a new owner', (done) => {
    service.updateToken(INPUT_REMOTE_ID, INPUT_TOKEN_UPDATE_DTO).subscribe((res) => {
      expect(res).toEqual(OUTPUT_TRANSFER_TOKEN);
      done();
    });
  });
   */
});
