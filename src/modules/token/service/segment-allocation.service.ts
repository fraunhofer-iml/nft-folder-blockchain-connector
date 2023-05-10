/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { TokenAbi } from './token.abi';
import { ErrorDto } from '../../../dto/error.dto';

@Injectable()
export class SegmentAllocationService {
  private contract: any;

  constructor(
    private readonly blockchainConnectorService: BlockchainConnectorService,
    private apiConfigService: ApiConfigService,
  ) {
    this.contract = new this.blockchainConnectorService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public getSegments(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getSegments(tokenId));
  }

  public getSegment(tokenId: number, segmentAddressIndex: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getSegment(tokenId, segmentAddressIndex));
  }

  public getNumberOfSegments(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getNumberOfSegments(tokenId));
  }

  public isTokenInSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.isTokenInSegment(tokenId, segmentAddress));
  }
}
