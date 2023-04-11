/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../settings/apiConfig.service';
import { Injectable } from '@nestjs/common';
import { TokenAbi } from './token.abi';
import { Observable } from 'rxjs';
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

  public getSegmentCountByToken(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getSegmentCountByToken(tokenId));
  }

  public getSegmentForTokenAtSegmentIndex(tokenId: number, segmentIndex: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(
      this.contract.methods.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex),
    );
  }

  public getIndexForTokenAtSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(
      this.contract.methods.getIndexForTokenAtSegment(tokenId, segmentAddress),
    );
  }

  public isTokenInSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.isTokenInSegment(tokenId, segmentAddress));
  }
}
