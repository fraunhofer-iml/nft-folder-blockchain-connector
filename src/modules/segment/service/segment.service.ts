/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import TransactionReceipt from 'web3/types';
import Contract from 'web3/eth/contract';

import { BlockchainService } from '../../blockchain/service/blockchain.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { SegmentAbi } from '../../../abi/segment.abi';
import { ContainerAbi } from '../../../abi/container.abi';
import { GetSegmentDto } from '../../../dto/getSegment.dto';
import { TokenContractInfoDto } from '../../../dto/token.dto';

@Injectable()
export class SegmentService {
  private containerContract: Contract;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.containerContract = new this.blockchainService.web3.eth.Contract(
      ContainerAbi,
      this.apiConfigService.CONTAINER_ADDRESS,
    );
  }

  private getSegmentContract(segmentAddress: string): Contract {
    return new this.blockchainService.web3.eth.Contract(SegmentAbi, segmentAddress);
  }

  public createSegment(name: string): Observable<TransactionReceipt> {
    return this.blockchainService.sendTransaction(this.containerContract.methods.createSegment(name));
  }

  // TODO-MP: a segmentId would be nice
  // TODO-MP: error when no segments available
  public getAllSegments(): Observable<GetSegmentDto[]> {
    return this.blockchainService.call(this.containerContract.methods.getAllSegments()).pipe(
      mergeMap((segmentAddresses) =>
        forkJoin(segmentAddresses.map((segmentAddress) => this.getSegmentData(segmentAddress))),
      ),
      map((segments: any) =>
        segments.map(([segmentAddress, name, tokenContractInfo]) =>
          this.createSegmentObject(segmentAddress, name, tokenContractInfo),
        ),
      ),
    );
  }

  public getSegment(index: number): Observable<GetSegmentDto> {
    return this.blockchainService.call(this.containerContract.methods.getSegment(index)).pipe(
      mergeMap((segmentAddress) => this.getSegmentData(segmentAddress)),
      map(([segmentAddress, name, tokenContractInfo]) =>
        this.createSegmentObject(segmentAddress, name, tokenContractInfo),
      ),
    );
  }

  private getSegmentData(segmentAddress: string): Observable<[string, any, any]> {
    return forkJoin([
      of(segmentAddress),
      this.blockchainService.call(this.getSegmentContract(segmentAddress).methods.getName()),
      this.blockchainService.call(this.getSegmentContract(segmentAddress).methods.getAllTokenInformation()),
    ]);
  }

  private createSegmentObject(segmentAddress: string, segmentName: string, tokenContractInfo: any): GetSegmentDto {
    const tokens = tokenContractInfo.map(([tokenAddress, tokenId]) => new TokenContractInfoDto(tokenAddress, tokenId));
    return new GetSegmentDto(segmentAddress, segmentName, tokens);
  }

  public addToken(index: number, tokenAddress: string, tokenId: number): Observable<TransactionReceipt> {
    return this.blockchainService
      .call(this.containerContract.methods.getSegment(index))
      .pipe(
        mergeMap((segmentAddress) =>
          this.blockchainService.sendTransaction(
            this.getSegmentContract(segmentAddress).methods.addToken(tokenAddress, tokenId),
          ),
        ),
      );
  }

  public removeToken(index: number, tokenAddress: string, tokenId: number): Observable<TransactionReceipt> {
    return this.blockchainService
      .call(this.containerContract.methods.getSegment(index))
      .pipe(
        mergeMap((segmentAddress) =>
          this.blockchainService.sendTransaction(
            this.getSegmentContract(segmentAddress).methods.removeToken(tokenAddress, tokenId),
          ),
        ),
      );
  }
}
