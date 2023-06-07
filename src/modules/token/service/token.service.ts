/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { forkJoin, from, map, mergeMap, Observable, switchMap } from 'rxjs';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';

import { EventInformationService } from './eventInformation.service';
import { SegmentService } from '../../segment/service/segment.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { BlockchainService } from '../../blockchain/service/blockchain.service';

import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto, TokenUpdateDto } from '../../../dto/token.dto';
import { GetSegmentDto } from '../../../dto/getSegment.dto';
import { TokenAbi } from '../../../abi/token.abi';

@Injectable()
export class TokenService {
  private tokenContract: any;

  constructor(
    private readonly eventInformationService: EventInformationService,
    private readonly segmentService: SegmentService,
    private readonly apiConfigService: ApiConfigService,
    private readonly blockchainService: BlockchainService,
  ) {
    this.tokenContract = new this.blockchainService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public getTokenByRemoteId(remoteId: string): Observable<TokenGetDto> {
    return this.getTokenId(remoteId).pipe(mergeMap((tokenId) => this.getTokenByTokenId(tokenId)));
  }

  private getTokenId(remoteId: string) {
    return this.blockchainService.call(this.tokenContract.methods.getTokenId(remoteId));
  }

  public getTokenByTokenId(tokenId: number): Observable<TokenGetDto> {
    return forkJoin([
      this.blockchainService.call(this.tokenContract.methods.ownerOf(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getAssetInformation(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getMetadataUri(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getMetadataHash(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getRemoteId(tokenId)),
      this.blockchainService.call(this.tokenContract.methods.getAdditionalInformation(tokenId)),
    ]).pipe(
      switchMap(([ownerAddress, assetInformation, metadataUri, metadataHash, remoteId, additionalInformation]) => {
        const asset = new TokenAssetDto(assetInformation.assetUri, assetInformation.assetHash);
        const metadata = new TokenMetadataDto(metadataUri, metadataHash);

        return from(this.eventInformationService.getMinterAddressAndLastUpdatedOn(tokenId)).pipe(
          map(({ minterAddress, lastUpdatedOn }: { minterAddress: string; lastUpdatedOn: string }) => {
            return new TokenGetDto(
              remoteId,
              asset,
              metadata,
              additionalInformation,
              ownerAddress,
              minterAddress,
              lastUpdatedOn,
              tokenId,
              this.apiConfigService.TOKEN_ADDRESS,
            );
          }),
        );
      }),
    );
  }

  public getAllSegments(id: string): Observable<GetSegmentDto[]> {
    return this.segmentService
      .getAllSegments()
      .pipe(
        map((segments) =>
          segments.filter(
            (segment) =>
              segment.tokenContractInfos &&
              segment.tokenContractInfos.length > 0 &&
              segment.tokenContractInfos.some((token) => token.tokenId === id),
          ),
        ),
      );
  }

  public mintToken(mintTokenDto: TokenMintDto): Observable<TransactionReceipt> {
    const transactionObject: TransactionObject<any> = this.tokenContract.methods.safeMint(
      this.blockchainService.getPublicAddress(),
      mintTokenDto.asset.uri,
      mintTokenDto.asset.hash,
      mintTokenDto.metadata.uri,
      mintTokenDto.metadata.hash,
      mintTokenDto.remoteId,
      mintTokenDto.additionalInformation,
    );
    return this.blockchainService.sendTransaction(transactionObject);
  }

  public updateToken(remoteId: string, tokenUpdateDto: TokenUpdateDto): Observable<string[]> {
    const contractFunctions = {
      assetUri: 'setAssetUri',
      assetHash: 'setAssetHash',
      metadataUri: 'setMetadataUri',
      metadataHash: 'setMetadataHash',
      additionalInformation: 'setAdditionalInformation',
    };

    return this.getTokenId(remoteId).pipe(
      mergeMap((tokenId) => {
        const transactionObjects: TransactionObject<any>[] = [];

        // Create a transactionObject for every dto property that corresponds to a contract function
        for (const propertyName in tokenUpdateDto) {
          if (propertyName in contractFunctions) {
            const contractFunction = contractFunctions[propertyName];
            const newValue = tokenUpdateDto[propertyName];
            const transactionObject = this.tokenContract.methods[contractFunction](tokenId, newValue);
            transactionObjects.push(transactionObject);
          }
        }

        return this.blockchainService.sendBatchTransactions(transactionObjects);
      }),
    );
  }

  public burnToken(tokenId: string): Observable<TransactionReceipt> {
    return this.blockchainService.sendTransaction(this.tokenContract.methods.burn(tokenId));
  }
}
