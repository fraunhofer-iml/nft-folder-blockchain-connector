/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TokenAmqpController } from './tokenAmqpController';
import { TokenService } from '../../service/token.service';
import { TransferTokenDto } from '../../../../dto/transferToken.dto';
import { AssetDto, GetTokenDto, MetadataDto, MintTokenDto } from '../../../../dto/token.dto';
import { GetSegmentDto } from '../../../../dto/getSegment.dto';

// TODO-LG: add tests for error cases
describe('TokenController', () => {
  let controller: TokenAmqpController;
  let fakeService: Partial<TokenService>;

  // test input
  const INPUT_TOKEN_ID = 12;
  const INPUT_TOKEN_SENDER = 'inputTokenSender';
  const INPUT_TOKEN_RECEIVER = 'inputTokenReceiver';
  const INPUT_TOKEN_MINT_DTO: MintTokenDto = new MintTokenDto('', new AssetDto('', ''), new MetadataDto('', ''), '');
  const INPUT_TRANSFER_DTO = new TransferTokenDto(INPUT_TOKEN_SENDER, INPUT_TOKEN_RECEIVER);

  // test output
  const OUTPUT_MINT_TOKEN: any = {};
  const OUTPUT_GET_TOKEN: GetTokenDto = new GetTokenDto('', '', '', new AssetDto('', ''), new MetadataDto('', ''), '');
  const OUTPUT_GET_SEGMENTS: GetSegmentDto[] = [];
  const OUTPUT_BURN_TOKEN: any = {};
  const OUTPUT_TRANSFER_TOKEN: any = {};

  beforeEach(async () => {
    fakeService = {
      mintToken: () => of(OUTPUT_MINT_TOKEN),
      getToken: () => of(OUTPUT_GET_TOKEN),
      getAllSegments: () => of(OUTPUT_GET_SEGMENTS),
      burnToken: () => of(OUTPUT_BURN_TOKEN),
      transferToken: () => of(OUTPUT_TRANSFER_TOKEN),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: fakeService,
        },
      ],
      controllers: [TokenAmqpController],
    }).compile();

    controller = module.get<TokenAmqpController>(TokenAmqpController);
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
    controller
      .getAllSegments({
        tokenId: INPUT_TOKEN_ID,
      })
      .subscribe((res) => {
        expect(res).toEqual(OUTPUT_GET_SEGMENTS);
        done();
      });
  });

  it('should burn an existing token', (done) => {
    controller
      .burnToken({
        tokenId: INPUT_TOKEN_ID,
      })
      .subscribe((res) => {
        expect(res).toEqual(OUTPUT_BURN_TOKEN);
        done();
      });
  });

  it('should transfer a token from the current owner to a new owner', (done) => {
    controller.transferToken(INPUT_TRANSFER_DTO).subscribe((res) => {
      expect(res).toEqual(OUTPUT_TRANSFER_TOKEN);
      done();
    });
  });
});
