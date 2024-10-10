/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { Contract, TransactionReceipt } from 'ethers';

import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { SegmentReadDto } from './dto/segment.read.dto';
import { TokenInformationDto } from 'src/token/dto/token.information.dto';

@Injectable()
export class SegmentService {
  private containerInstance: Contract;
  private segmentAbi: string;

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly configurationService: ConfigurationService,
  ) {
    this.containerInstance = this.blockchainService.getContractInstance(
      this.configurationService.getBlockchainConfiguration().containerAddress,
      this.configurationService.getBlockchainConfiguration().containerAbi,
    );

    this.segmentAbi = this.configurationService.getBlockchainConfiguration().segmentAbi;
  }

  public async createSegment(name: string): Promise<TransactionReceipt> {
    try {
      return await this.containerInstance.createSegment(name);
    } catch (err) {
      this.blockchainService.handleError(err, this.containerInstance.target.toString());
      return Promise.reject(err);
    }
  }

  public async fetchAllSegments(): Promise<SegmentReadDto[]> {
    try {
      const segmentReadDtos: SegmentReadDto[] = [];
      const segmentAddresses: string[] = await this.containerInstance.getAllSegments();

      for (const segmentAddress of segmentAddresses) {
        const segmentReadDto: SegmentReadDto = await this.fetchSegmentData(segmentAddress);
        segmentReadDtos.push(segmentReadDto);
      }

      return segmentReadDtos;
    } catch (err) {
      this.blockchainService.handleError(err, this.containerInstance.target.toString());
      return Promise.reject(err);
    }
  }

  public async fetchSegment(index: number): Promise<SegmentReadDto> {
    try {
      const segmentAddress: string = await this.containerInstance.getSegment(index);
      return await this.fetchSegmentData(segmentAddress);
    } catch (err) {
      this.blockchainService.handleError(err, this.containerInstance.target.toString());
      return Promise.reject(err);
    }
  }

  private async fetchSegmentData(segmentAddress: string): Promise<SegmentReadDto> {
    try {
      const segmentName: string = await this.getSegmentInstance(segmentAddress).getName();

      const tokenInformation = await this.getSegmentInstance(segmentAddress).getAllTokenInformation();
      const tokenInformationDto: TokenInformationDto[] = tokenInformation.map(
        ([tokenAddress, tokenId]) => new TokenInformationDto(tokenAddress, Number(tokenId).toString()),
      );

      return new SegmentReadDto(segmentAddress, segmentName, tokenInformationDto);
    } catch (err) {
      this.blockchainService.handleError(err, segmentAddress);
      return Promise.reject(err);
    }
  }

  public async addToken(segmentIndex: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    let segmentAddress: string;

    try {
      segmentAddress = await this.containerInstance.getSegment(segmentIndex);
      return await this.getSegmentInstance(segmentAddress).addToken(tokenAddress, tokenId);
    } catch (err) {
      this.blockchainService.handleError(err, segmentAddress);
      return Promise.reject(err);
    }
  }

  public async removeToken(segmentIndex: number, tokenAddress: string, tokenId: number): Promise<TransactionReceipt> {
    let segmentAddress: string;

    try {
      segmentAddress = await this.containerInstance.getSegment(segmentIndex);
      return await this.getSegmentInstance(segmentAddress).removeToken(tokenAddress, tokenId);
    } catch (err) {
      this.blockchainService.handleError(err, segmentAddress);
      return Promise.reject(err);
    }
  }

  private getSegmentInstance(segmentAddress: string): Contract {
    return this.blockchainService.getContractInstance(segmentAddress, this.segmentAbi);
  }
}
