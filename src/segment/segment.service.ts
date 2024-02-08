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
import Web3 from 'web3';

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

  // TODO-MP: a segmentId would be nice
  // TODO-MP: error when no segments available
  public async getAllSegments(): Promise<SegmentReadDto[]> {
    const segmentAddressList = await this.blockchainService.call(this.containerContract.methods.getAllSegments());
    const segmentList = [];
    for (const singleSegmentAddress of segmentAddressList) {
      const [segmentAddress, name, tokenContractInfo] = await this.getSegmentData(singleSegmentAddress);
      segmentList.push(this.createSegmentObject(segmentAddress, name, tokenContractInfo));
    }
    return segmentList;
  }

  public async getSegment(index: number): Promise<SegmentReadDto> {
    const foundSegmentAddress = await this.blockchainService.call(this.containerContract.methods.getSegment(index));
    const [segmentAddress, name, tokenContractInfo] = await this.getSegmentData(foundSegmentAddress);
    return this.createSegmentObject(segmentAddress, name, tokenContractInfo);
  }

  private async getSegmentData(segmentAddress: string): Promise<(string | any)[]> {
    return [
      segmentAddress,
      await this.blockchainService.call(this.getSegmentContract(segmentAddress).methods.getName()),
      await this.blockchainService.call(this.getSegmentContract(segmentAddress).methods.getAllTokenInformation()),
    ];
  }

  private createSegmentObject(segmentAddress: string, segmentName: string, tokenContractInfo: any): SegmentReadDto {
    const tokens = tokenContractInfo.map(([tokenAddress, tokenId]) => new TokenContractInfoDto(tokenAddress, tokenId));
    return new SegmentReadDto(segmentAddress, segmentName, tokens);
  }

  public async addToken(index: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    if (!Web3.utils.isAddress(tokenAddress)) {
      await this.blockchainService.handleError({ message: `'${tokenAddress}' is not an address` });
    }
    const segmentAddress = await this.blockchainService.call(this.containerContract.methods.getSegment(index));
    return this.blockchainService.sendTransaction(
      this.getSegmentContract(segmentAddress).methods.addToken(tokenAddress, tokenId),
    );
  }

  public async removeToken(index: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    if (!Web3.utils.isAddress(tokenAddress)) {
      await this.blockchainService.handleError({ message: `'${tokenAddress}' is not an address` });
    }

    const segmentAddress = await this.blockchainService.call(this.containerContract.methods.getSegment(index));
    return this.blockchainService.sendTransaction(
      this.getSegmentContract(segmentAddress).methods.removeToken(tokenAddress, tokenId),
    );
  }
}
