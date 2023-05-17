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

import { BlockchainService } from '../../blockchain/service/blockchain.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { SegmentService } from '../../segment/service/segment.service';
import { AssetDto, GetTokenDto, MetadataDto, MintTokenDto } from '../../../dto/token.dto';
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

  public mintToken(mintTokenDto: MintTokenDto): Observable<TransactionReceipt> {
    const transactionObject: TransactionObject<any> = mintTokenDto.additionalInformation
      ? this.tokenContract.methods.safeMint(
          mintTokenDto.ownerAddress,
          mintTokenDto.asset.uri,
          mintTokenDto.asset.hash,
          mintTokenDto.metadata.uri,
          mintTokenDto.metadata.hash,
          mintTokenDto.additionalInformation,
        )
      : this.tokenContract.methods.safeMint(
          mintTokenDto.ownerAddress,
          mintTokenDto.asset.uri,
          mintTokenDto.asset.hash,
          mintTokenDto.metadata.uri,
          mintTokenDto.metadata.hash,
        );
    return this.blockchainService.sendTransaction(transactionObject);
  }

  public getToken(id: string): Observable<GetTokenDto> {
    return forkJoin([
      this.blockchainService.call(this.tokenContract.methods.ownerOf(id)),
      this.blockchainService.call(this.tokenContract.methods.getAssetInformation(id)),
      this.blockchainService.call(this.tokenContract.methods.tokenURI(id)),
      this.blockchainService.call(this.tokenContract.methods.getMetadataHash(id)),
      this.blockchainService.call(this.tokenContract.methods.getAdditionalInformation(id)),
    ]).pipe(
      map(([ownerAddress, assetInformation, tokenUri, metadataHash, additionalInformation]) => {
        const asset = new AssetDto(assetInformation.assetUri, assetInformation.assetHash);
        const metadata = new MetadataDto(tokenUri, metadataHash);
        return new GetTokenDto(
          this.apiConfigService.TOKEN_ADDRESS,
          id,
          ownerAddress,
          asset,
          metadata,
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
              segment.tokens && segment.tokens.length > 0 && segment.tokens.some((token) => token.tokenId === id),
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
