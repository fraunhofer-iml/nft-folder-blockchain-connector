/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Injectable } from '@nestjs/common';
import { containerAbi } from './container.abi';
import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../settings/apiConfig.service';
import { Observable } from 'rxjs';
import { ErrorDto } from '../../../dto/error.dto';

@Injectable()
export class ContainerService {
  private contract: any;

  constructor(
    private readonly blockchainConnectorService: BlockchainConnectorService,
    private apiConfigService: ApiConfigService,
  ) {
    this.contract = new this.blockchainConnectorService.web3.eth.Contract(
      containerAbi,
      apiConfigService.CONTAINER_ADDRESS,
    );
  }

  public createSegment(name: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.createSegment(name));
  }

  public getName(): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getName());
  }

  public getSegmentCount(): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getSegmentCount());
  }

  public getSegmentAtIndex(index: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getSegmentAtIndex(index));
  }

  public isSegmentInContainer(segment: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.isSegmentInContainer(segment));
  }
}
