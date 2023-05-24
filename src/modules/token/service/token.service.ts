/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { forkJoin, map, Observable } from 'rxjs';
import { TransactionObject } from 'web3/eth/types';
import TransactionReceipt from 'web3/types';
import Web3 from 'web3';

import { BlockchainService } from '../../blockchain/service/blockchain.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { SegmentService } from '../../segment/service/segment.service';
import { TokenAssetDto, TokenGetDto, TokenMetadataDto, TokenMintDto } from '../../../dto/token.dto';
import { GetSegmentDto } from '../../../dto/getSegment.dto';
import { TokenAbi } from '../../../abi/token.abi';

@Injectable()
export class TokenService {
  private tokenContract: any;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly segmentService: SegmentService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.tokenContract = new this.blockchainService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public mintToken(mintTokenDto: TokenMintDto): Observable<TransactionReceipt> {
    if (!Web3.utils.isAddress(mintTokenDto.ownerAddress)) {
      this.blockchainService.handleError({ message: `'${mintTokenDto.ownerAddress}' is not an address` });
    }

    const transactionObject: TransactionObject<any> = this.tokenContract.methods.safeMint(
      mintTokenDto.ownerAddress,
      mintTokenDto.asset.uri,
      mintTokenDto.asset.hash,
      mintTokenDto.metadata.uri,
      mintTokenDto.metadata.hash,
      mintTokenDto.remoteId,
      mintTokenDto.additionalInformation,
    );
    return this.blockchainService.sendTransaction(transactionObject);
  }

  public getToken(id: string): Observable<TokenGetDto> {
    return forkJoin([
      this.blockchainService.call(this.tokenContract.methods.ownerOf(id)),
      this.blockchainService.call(this.tokenContract.methods.getAssetInformation(id)),
      this.blockchainService.call(this.tokenContract.methods.tokenURI(id)),
      this.blockchainService.call(this.tokenContract.methods.getMetadataHash(id)),
      this.blockchainService.call(this.tokenContract.methods.getRemoteId(id)),
      this.blockchainService.call(this.tokenContract.methods.getAdditionalInformation(id)),
    ]).pipe(
      map(([ownerAddress, assetInformation, tokenUri, metadataHash, remoteId, additionalInformation]) => {
        const asset = new TokenAssetDto(assetInformation.assetUri, assetInformation.assetHash);
        const metadata = new TokenMetadataDto(tokenUri, metadataHash);

        return new TokenGetDto(
          this.apiConfigService.TOKEN_ADDRESS,
          id,
          ownerAddress,
          asset,
          metadata,
          remoteId,
          additionalInformation,
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

  public burnToken(tokenId: string): Observable<TransactionReceipt> {
    return this.blockchainService.sendTransaction(this.tokenContract.methods.burn(tokenId));
  }

  public transferToken(tokenId: string, from: string, to: string): Observable<TransactionReceipt> {
    return this.blockchainService.sendTransaction(this.tokenContract.methods.safeTransferFrom(from, to, tokenId));
  }
}
