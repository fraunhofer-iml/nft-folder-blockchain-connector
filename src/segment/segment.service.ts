/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import TransactionReceipt from 'web3/types';
import Contract from 'web3/eth/contract';

import { ApiConfigService } from '../config/api.config.service';
import { BlockchainService } from '../shared/blockchain.service';
import { SegmentReadDto } from './dto/segment.read.dto';
import { TokenContractInfoDto } from '../token/dto/token.dto';
import { SegmentAbi } from './abi/segment.abi';
import { ContainerAbi } from './abi/container.abi';

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

  public createSegment(name: string): Promise<TransactionReceipt> {
    return this.blockchainService.sendTransaction(this.containerContract.methods.createSegment(name));
  }

  public async fetchAllSegments(): Promise<SegmentReadDto[]> {
    const segmentAddresses = await this.blockchainService.call(this.containerContract.methods.getAllSegments());
    const segments: SegmentReadDto[] = [];

    for (const currentSegmentAddress of segmentAddresses) {
      const segment: SegmentReadDto = await this.fetchSegmentData(currentSegmentAddress);
      segments.push(segment);
    }

    return segments;
  }

  public async fetchSegment(index: number): Promise<SegmentReadDto> {
    const foundSegmentAddress = await this.blockchainService.call(this.containerContract.methods.getSegment(index));
    return await this.fetchSegmentData(foundSegmentAddress);
  }

  private async fetchSegmentData(segmentAddress: string): Promise<SegmentReadDto> {
    const segmentName = await this.blockchainService.call(this.getSegmentContract(segmentAddress).methods.getName());
    const tokenContractInfo = await this.blockchainService.call(
      this.getSegmentContract(segmentAddress).methods.getAllTokenInformation(),
    );
    return new SegmentReadDto(
      segmentAddress,
      segmentName,
      tokenContractInfo.map(([tokenAddress, tokenId]) => new TokenContractInfoDto(tokenAddress, tokenId)),
    );
  }

  public async addToken(segmentIndex: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    const segmentAddress = await this.blockchainService.call(this.containerContract.methods.getSegment(segmentIndex));
    return this.blockchainService.sendTransaction(
      this.getSegmentContract(segmentAddress).methods.addToken(tokenAddress, tokenId),
    );
  }

  public async removeToken(segmentIndex: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    const segmentAddress = await this.blockchainService.call(this.containerContract.methods.getSegment(segmentIndex));
    return this.blockchainService.sendTransaction(
      this.getSegmentContract(segmentAddress).methods.removeToken(tokenAddress, tokenId),
    );
  }
}
