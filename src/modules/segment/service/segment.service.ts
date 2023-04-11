/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { Injectable } from '@nestjs/common';
import { SegmentAbi } from './segment.abi';
import { Observable } from 'rxjs';
import { ErrorDto } from '../../../dto/error.dto';

@Injectable()
export class SegmentService {
  constructor(private readonly blockchainConnectorService: BlockchainConnectorService) {}

  getSegmentContract(segmentAddress: string) {
    return new this.blockchainConnectorService.web3.eth.Contract(SegmentAbi, segmentAddress);
  }

  public addToken(tokenAddress: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(
      this.getSegmentContract(segmentAddress).methods.addToken(tokenAddress, tokenId),
    );
  }

  public removeToken(tokenAddress: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(
      this.getSegmentContract(segmentAddress).methods.removeToken(tokenAddress, tokenId),
    );
  }

  public getName(segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.getName());
  }

  public getContainer(segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.getContainer());
  }

  public getTokenInformation(segmentAddress: string, index: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(
      this.getSegmentContract(segmentAddress).methods.getTokenInformation(index),
    );
  }

  public getTokenLocationInSegment(
    tokenAddress: string,
    tokenId: number,
    segmentAddress: string,
  ): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(
      this.getSegmentContract(segmentAddress).methods.getTokenLocationInSegment(tokenAddress, tokenId),
    );
  }

  public isTokenInSegment(tokenAddress: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(
      this.getSegmentContract(segmentAddress).methods.isTokenInSegment(tokenAddress, tokenId),
    );
  }
}
