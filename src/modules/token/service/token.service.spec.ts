/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import Web3 from 'web3';
import { mock, resetMocks } from '@depay/web3-mock';
import { areMethodsEqual } from '../../utils/test.utils';
import { TokenService } from './token.service';
import { TokenMintDto } from '../../../dto/tokenMint.dto';
import { TokenAbi } from './token.abi';
import { AbiItem } from 'web3-utils';

describe('TokenService', () => {
  let service: TokenService;
  let fakeBlockchainConnectorService: Partial<BlockchainConnectorService>;
  let fakeApiConfigServiceService: Partial<ApiConfigService>;

  //web3 mock
  const blockchain = 'ethereum';
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045'];
  beforeEach(resetMocks);
  beforeEach(() => mock({ blockchain, accounts: { return: accounts } }));
  const provider = new Web3.providers.HttpProvider(global.ethereum);
  const web3 = new Web3(provider);

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
    fakeApiConfigServiceService = {
      TOKEN_ADDRESS: '0x1f7b7F7F6A0a32496eE805b6532f686E40568D83',
    };

    const compareFakeContract = new web3.eth.Contract(TokenAbi as AbiItem[], fakeApiConfigServiceService.TOKEN_ADDRESS);

    fakeBlockchainConnectorService = {
      web3: web3,
      sendTransaction: (transaction) => {
        if (areMethodsEqual(transaction, compareFakeContract.methods.approve(fakeTokenReceiver, fakeTokenId))) {
          return of(fakeApprovalResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.burn(fakeTokenId))) {
          return of(fakeBurnResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.renounceOwnership())) {
          return of(fakeRenounceOwnershipResponse);
        } else if (
          areMethodsEqual(
            transaction,
            compareFakeContract.methods.safeMint(
              fakeTokenReceiver,
              fakeAssetUri,
              fakeAssetHash,
              fakeMetadataUri,
              fakeMetadataHash,
              fakeAdditionalInforamtion,
            ),
          )
        ) {
          return of(fakeSafeMintResponse);
        } else if (
          areMethodsEqual(
            transaction,
            compareFakeContract.methods.safeTransferFrom(fakeTokenSender, fakeTokenReceiver, fakeTokenId),
          )
        ) {
          return of(fakeSafeTransferFromResponse);
        } else if (
          areMethodsEqual(transaction, compareFakeContract.methods.setApprovalForAll(fakeOperator, fakeapproved))
        ) {
          return of(fakeSetApprovalForAllResponse);
        } else if (
          areMethodsEqual(
            transaction,
            compareFakeContract.methods.transferFrom(fakeTokenSender, fakeTokenReceiver, fakeTokenId),
          )
        ) {
          return of(fakeTransferFromResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.transferOwnership(fakeOwner))) {
          return of(fakeTransferOwnershipResponse);
        }
      },
      call: (transaction) => {
        if (areMethodsEqual(transaction, compareFakeContract.methods.balanceOf(fakeOwner))) {
          return of(fakeBalanceOfResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.getAdditionalInformation(fakeTokenId))) {
          return of(fakeGetAdditionalInformationResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.getApproved(fakeTokenId))) {
          return of(fakeGetApprovedResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.getAssetInformation(fakeTokenId))) {
          return of(fakeGetAssetInformationResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.getAssetHash(fakeTokenId))) {
          return of(fakeGetAssetHashResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.getAssetUri(fakeTokenId))) {
          return of(fakeGetAssetUriResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.getMetadataHash(fakeTokenId))) {
          return of(fakeGetMetadataHashResponse);
        } else if (
          areMethodsEqual(transaction, compareFakeContract.methods.isApprovedForAll(fakeOwner, fakeOperator))
        ) {
          return of(fakeIsApprovedForAllResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.name())) {
          return of(fakeNameResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.owner())) {
          return of(fakeOwnerResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.ownerOf(fakeTokenId))) {
          return of(fakeOwnerOfResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.supportsInterface(fakeInterfaceId))) {
          return of(fakeSupportsInterfaceResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.symbol())) {
          return of(fakeSymbolResponse);
        } else if (areMethodsEqual(transaction, compareFakeContract.methods.tokenURI(fakeTokenId))) {
          return of(fakeGetTokenURIResponse);
        }
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockchainConnectorService,
          useValue: fakeBlockchainConnectorService,
        },
        {
          provide: ApiConfigService,
          useValue: fakeApiConfigServiceService,
        },
        TokenService,
      ],
    }).compile();
    service = module.get<TokenService>(TokenService);
  });

  it('should return approval response', (done) => {
    service.approve(fakeTokenReceiver, fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeApprovalResponse);
      done();
    });
  });

  it('should return burn response', (done) => {
    service.burn(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeBurnResponse);
      done();
    });
  });

  it('should return renounceOwnership response', (done) => {
    service.renounceOwnership().subscribe((res) => {
      expect(res).toEqual(fakeRenounceOwnershipResponse);
      done();
    });
  });

  it('should return safeMint response', (done) => {
    service.safeMint(fakeTokenMintDto).subscribe((res) => {
      expect(res).toEqual(fakeSafeMintResponse);
      done();
    });
  });

  it('should return safeTransferFrom response', (done) => {
    service.safeTransferFrom(fakeTokenSender, fakeTokenReceiver, fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeSafeTransferFromResponse);
      done();
    });
  });

  it('should return setApprovalForAll response', (done) => {
    service.setApprovalForAll(fakeOperator, fakeapproved).subscribe((res) => {
      expect(res).toEqual(fakeSetApprovalForAllResponse);
      done();
    });
  });

  it('should return transferFrom response', (done) => {
    service.transferFrom(fakeTokenSender, fakeTokenReceiver, fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeTransferFromResponse);
      done();
    });
  });

  it('should return transferOwnership response', (done) => {
    service.transferOwnership(fakeOwner).subscribe((res) => {
      expect(res).toEqual(fakeTransferOwnershipResponse);
      done();
    });
  });

  it('should return balanceOf response', (done) => {
    service.balanceOf(fakeOwner).subscribe((res) => {
      expect(res).toEqual(fakeBalanceOfResponse);
      done();
    });
  });

  it('should return getAdditionalInformation response', (done) => {
    service.getAdditionalInformation(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAdditionalInformationResponse);
      done();
    });
  });

  it('should return getApproved response', (done) => {
    service.getApproved(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetApprovedResponse);
      done();
    });
  });

  it('should return getAssetInformation response', (done) => {
    service.getAssetInformation(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAssetInformationResponse);
      done();
    });
  });

  it('should return getAssetHash response', (done) => {
    service.getAssetHash(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAssetHashResponse);
      done();
    });
  });

  it('should return getAssetUri response', (done) => {
    service.getAssetUri(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetAssetUriResponse);
      done();
    });
  });

  it('should return getMetadataHash response', (done) => {
    service.getMetadataHash(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetMetadataHashResponse);
      done();
    });
  });

  it('should return isApprovedForAll response', (done) => {
    service.isApprovedForAll(fakeOwner, fakeOperator).subscribe((res) => {
      expect(res).toEqual(fakeIsApprovedForAllResponse);
      done();
    });
  });

  it('should return name response', (done) => {
    service.name().subscribe((res) => {
      expect(res).toEqual(fakeNameResponse);
      done();
    });
  });

  it('should return owner response', (done) => {
    service.owner().subscribe((res) => {
      expect(res).toEqual(fakeOwnerResponse);
      done();
    });
  });

  it('should return ownerOf response', (done) => {
    service.ownerOf(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeOwnerOfResponse);
      done();
    });
  });

  it('should return supportsInterface response', (done) => {
    service.supportsInterface(fakeInterfaceId).subscribe((res) => {
      expect(res).toEqual(fakeSupportsInterfaceResponse);
      done();
    });
  });

  it('should return symbol response', (done) => {
    service.symbol().subscribe((res) => {
      expect(res).toEqual(fakeSymbolResponse);
      done();
    });
  });

  it('should return getTokenURI response', (done) => {
    service.getTokenURI(fakeTokenId).subscribe((res) => {
      expect(res).toEqual(fakeGetTokenURIResponse);
      done();
    });
  });
});
