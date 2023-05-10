/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TokenRestController } from './token.rest.controller';
import { TokenService } from '../../service/token.service';
import { TokenMintDto } from '../../../../dto/tokenMint.dto';
import { ApprovalDto } from '../../../../dto/approval.dto';
import { TransferDto } from '../../../../dto/transfer.dto';

//TODO-LG: add tests for error cases
describe('TokenController', () => {
  let controller: TokenRestController;
  let fakeTokenService: Partial<TokenService>;

  //test input
  const fakeTokenId = 12;
  const fakeTokenReceiver = 'newFakeTokenReceiver';
  const fakeTokenSender = 'newFakeTokenSender';
  const fakeOperator = 'fakeOperator';
  const fakeapproved = true;
  const fakeOwner = 'fakeOwner';
  const fakeInterfaceId = 'fakeInterfaceId';
  const fakeAssetUri = 'fakeAssetUri';
  const fakeAssetHash = 'fakeAssetHash';
  const fakeMetadataUri = 'fakeMetadataUri';
  const fakeMetadataHash = 'fakeMetadataHash';
  const fakeAdditionalInforamtion = 'fakeAddtionalInformation';
  const fakeTokenMintDto = new TokenMintDto(
    fakeTokenReceiver,
    fakeAssetUri,
    fakeAssetHash,
    fakeMetadataUri,
    fakeMetadataHash,
    fakeAdditionalInforamtion,
  );
  const fakeApprovalDto = new ApprovalDto(fakeTokenReceiver, fakeTokenId);
  const fakeTransferDto = new TransferDto(fakeTokenSender, fakeTokenReceiver, fakeTokenId);

  //test responses
  const fakeApprovalResponse = 'fakeApprovalResponse';
  const fakeBurnResponse = 'fakeBurnResponse';
  const fakeRenounceOwnershipResponse = 'fakeRenounceOwnershipResponse';
  const fakeSafeMintResponse = 'fakeSafeMintResponse';
  const fakeSafeTransferFromResponse = 'fakeSafeTransferFromResponse';
  const fakeSetApprovalForAllResponse = 'fakeSetApprovalForAllResponse';
  const fakeTransferFromResponse = 'fakeTransferFromResponse';
  const fakeTransferOwnershipResponse = 'fakeTransferOwnershipResponse';
  const fakeBalanceOfResponse = 'fakeBalanceOfResponse';
  const fakeGetAdditionalInformationResponse = 'fakeGetAdditionalInformationResponse';
  const fakeGetApprovedResponse = 'fakeGetApprovedResponse';
  const fakeGetAssetInformationResponse = 'fakeGetAssetHashResponse';
  const fakeGetAssetHashResponse = 'fakeGetAssetHashResponse';
  const fakeGetAssetUriResponse = 'fakeGetAssetUriResponse';
  const fakeGetMetadataHashResponse = 'fakeGetMetadataHashResponse';
  const fakeIsApprovedForAllResponse = 'fakeIsApprovedForAllResponse';
  const fakeNameResponse = 'fakeNameResponse';
  const fakeOwnerResponse = 'fakeOwnerResponse';
  const fakeOwnerOfResponse = 'fakeOwnerOfResponse';
  const fakeSupportsInterfaceResponse = 'fakeSupportsInterfaceResponse';
  const fakeSymbolResponse = 'fakeSymbolResponse';
  const fakeGetTokenURIResponse = 'fakeGetTokenURIResponse';

  beforeEach(async () => {
    fakeTokenService = {
      approve: () => of(fakeApprovalResponse),
      burn: () => of(fakeBurnResponse),
      renounceOwnership: () => of(fakeRenounceOwnershipResponse),
      safeTransferFrom: () => of(fakeSafeTransferFromResponse),
      setApprovalForAll: () => of(fakeSetApprovalForAllResponse),
      safeMint: () => of(fakeSafeMintResponse),
      transferFrom: () => of(fakeTransferFromResponse),
      transferOwnership: () => of(fakeTransferOwnershipResponse),
      balanceOf: () => of(fakeBalanceOfResponse),
      getAdditionalInformation: () => of(fakeGetAdditionalInformationResponse),
      getApproved: () => of(fakeGetApprovedResponse),
      getAssetInformation: () => of(fakeGetAssetHashResponse),
      getAssetHash: () => of(fakeGetAssetHashResponse),
      getAssetUri: () => of(fakeGetAssetUriResponse),
      getMetadataHash: () => of(fakeGetMetadataHashResponse),
      isApprovedForAll: () => of(fakeIsApprovedForAllResponse),
      name: () => of(fakeNameResponse),
      owner: () => of(fakeOwnerResponse),
      ownerOf: () => of(fakeOwnerOfResponse),
      supportsInterface: () => of(fakeSupportsInterfaceResponse),
      symbol: () => of(fakeSymbolResponse),
      getTokenURI: () => of(fakeGetTokenURIResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: fakeTokenService,
        },
      ],
      controllers: [TokenRestController],
    }).compile();

    controller = module.get<TokenRestController>(TokenRestController);
  });

  it('should return approval response', (done) => {
    controller.approve(fakeApprovalDto).subscribe((res) => {
      expect(res).toEqual(fakeApprovalResponse);
      done();
    });
  });

  it('should return burn response', (done) => {
    controller.burn(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeBurnResponse);
      done();
    });
  });

  it('should return renounceOwnership response', (done) => {
    controller.renounceOwnership().subscribe((res) => {
      expect(res).toEqual(fakeRenounceOwnershipResponse);
      done();
    });
  });

  it('should return safeMint response', (done) => {
    controller.safeMint(fakeTokenMintDto).subscribe((res) => {
      expect(res).toEqual(fakeSafeMintResponse);
      done();
    });
  });

  it('should return safeTransferFrom response', (done) => {
    controller.safeTransferFrom(fakeTransferDto).subscribe((res) => {
      expect(res).toEqual(fakeSafeTransferFromResponse);
      done();
    });
  });

  it('should return setApprovalForAll response', (done) => {
    controller.setApprovalForAll(fakeOperator, fakeapproved).subscribe((res) => {
      expect(res).toEqual(fakeSetApprovalForAllResponse);
      done();
    });
  });

  it('should return transferFrom response', (done) => {
    controller.transferFrom(fakeTransferDto).subscribe((res) => {
      expect(res).toEqual(fakeTransferFromResponse);
      done();
    });
  });

  it('should return transferOwnership response', (done) => {
    controller.transferOwnership(fakeOwner).subscribe((res) => {
      expect(res).toEqual(fakeTransferOwnershipResponse);
      done();
    });
  });

  it('should return balanceOf response', (done) => {
    controller.balanceOf(fakeOwner).subscribe((res) => {
      expect(res).toEqual(fakeBalanceOfResponse);
      done();
    });
  });

  it('should return getAdditionalInformation response', (done) => {
    controller.getAdditionalInformation(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAdditionalInformationResponse);
      done();
    });
  });

  it('should return getApproved response', (done) => {
    controller.getApproved(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetApprovedResponse);
      done();
    });
  });

  it('should return getAssetHash response', (done) => {
    controller.getAssetInformation(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAssetInformationResponse);
      done();
    });
  });

  it('should return getAssetHash response', (done) => {
    controller.getAssetHash(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAssetHashResponse);
      done();
    });
  });

  it('should return getAssetUri response', (done) => {
    controller.getAssetUri(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAssetUriResponse);
      done();
    });
  });

  it('should return getMetadataHash response', (done) => {
    controller.getMetadataHash(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetMetadataHashResponse);
      done();
    });
  });

  it('should return isApprovedForAll response', (done) => {
    controller.isApprovedForAll(fakeOwner, fakeOperator).subscribe((res) => {
      expect(res).toEqual(fakeIsApprovedForAllResponse);
      done();
    });
  });

  it('should return name response', (done) => {
    controller.name().subscribe((res) => {
      expect(res).toEqual(fakeNameResponse);
      done();
    });
  });

  it('should return owner response', (done) => {
    controller.owner().subscribe((res) => {
      expect(res).toEqual(fakeOwnerResponse);
      done();
    });
  });

  it('should return ownerOf response', (done) => {
    controller.ownerOf(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeOwnerOfResponse);
      done();
    });
  });

  it('should return supportsInterface response', (done) => {
    controller.supportsInterface(fakeInterfaceId).subscribe((res) => {
      expect(res).toEqual(fakeSupportsInterfaceResponse);
      done();
    });
  });

  it('should return symbol response', (done) => {
    controller.symbol().subscribe((res) => {
      expect(res).toEqual(fakeSymbolResponse);
      done();
    });
  });

  it('should return getTokenURI response', (done) => {
    controller.getTokenURI(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetTokenURIResponse);
      done();
    });
  });
});
