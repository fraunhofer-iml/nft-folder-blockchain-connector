/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import TransactionReceipt from 'web3/types';
import { Contract } from 'ethers';

import { ApiConfigService } from '../config/api.config.service';
import { BlockchainService } from '../shared/blockchain.service';
import { SegmentReadDto } from './dto/segment.read.dto';
import { TokenInformationDto } from '../token/dto/token.dto';
import { ContainerAbi } from './abi/container.abi';
import { SegmentAbi } from './abi/segment.abi';

@Injectable()
export class SegmentService {
  private containerContract: Contract;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.containerContract = this.blockchainService.getContract(this.apiConfigService.CONTAINER_ADDRESS, ContainerAbi);
  }

  public async createSegment(name: string): Promise<TransactionReceipt> {
    try {
      return await this.containerContract.createSegment(name);
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  public async fetchAllSegments(): Promise<SegmentReadDto[]> {
    try {
      const segmentAddresses = await this.containerContract.getAllSegments();
      const segments: SegmentReadDto[] = [];

      for (const currentSegmentAddress of segmentAddresses) {
        const segment: SegmentReadDto = await this.fetchSegmentData(currentSegmentAddress);
        segments.push(segment);
      }

      return segments;
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  public async fetchSegment(index: number): Promise<SegmentReadDto> {
    try {
      const foundSegmentAddress = await this.containerContract.getSegment(index);
      return await this.fetchSegmentData(foundSegmentAddress);
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  private async fetchSegmentData(segmentAddress: string): Promise<SegmentReadDto> {
    const segmentName = await this.getSegmentContract(segmentAddress).getName();

    const tokenInformation = await this.getSegmentContract(segmentAddress).getAllTokenInformation();
    const tokenInformationDto = tokenInformation.map(
      ([tokenAddress, tokenId]) => new TokenInformationDto(tokenAddress, Number(tokenId).toString()),
    );

    return new SegmentReadDto(segmentAddress, segmentName, tokenInformationDto);
  }

  public async addToken(segmentIndex: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    try {
      const segmentAddress = await this.containerContract.getSegment(segmentIndex);
      return await this.getSegmentContract(segmentAddress).addToken(tokenAddress, tokenId);
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  public async removeToken(segmentIndex: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    try {
      const segmentAddress = await this.containerContract.getSegment(segmentIndex);
      return await this.getSegmentContract(segmentAddress).removeToken(tokenAddress, tokenId);
    } catch (err) {
      this.blockchainService.handleError(err);
      return Promise.reject(err);
    }
  }

  private getSegmentContract(segmentAddress: string): Contract {
    return this.blockchainService.getContract(segmentAddress, SegmentAbi);
  }
}
