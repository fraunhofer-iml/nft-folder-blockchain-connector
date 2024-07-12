/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { Contract, EventLog } from 'ethers';

import { ApiConfigService } from '../config/api.config.service';
import { BlockchainService } from '../shared/blockchain.service';
import { TokenAbi } from './abi/token.abi';

interface EventInformation {
  blockNumber: number;
  transactionHash: string;
}

export interface TokenInformation {
  minterAddress: string;
  createdOn: string;
  lastUpdatedOn: string;
}

@Injectable()
export class EventService {
  private tokenContract: Contract;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly blockchainService: BlockchainService,
  ) {
    this.tokenContract = this.blockchainService.getContract(this.apiConfigService.TOKEN_ADDRESS, TokenAbi);
  }

  public async fetchTokenInformation(tokenId: number): Promise<TokenInformation> {
    const minterAddress: string = await this.fetchMinterAddress(tokenId);
    const createdOn: string = await this.fetchCreatedOn(tokenId);
    const lastUpdatedOn: string = await this.fetchLastUpdatedOn(tokenId);
    return { minterAddress, createdOn, lastUpdatedOn };
  }

  private async fetchMinterAddress(tokenId: number): Promise<string> {
    const events = await this.getAllPastEvents('Transfer', tokenId);
    return events.length === 0 ? null : events[0].args.to;
  }

  private async fetchCreatedOn(tokenId: number): Promise<string> {
    const events = await this.getAllPastEvents('Transfer', tokenId);
    const transactionHash: string = events.length === 0 ? '' : events[0].transactionHash;

    const timestamp: number = await this.blockchainService.fetchTransactionTimestamp(transactionHash);
    const timestampInSeconds: Date = new Date(timestamp * 1000);
    return timestampInSeconds.toISOString();
  }

  private async fetchLastUpdatedOn(tokenId: number): Promise<string> {
    const eventNames = ['AssetUriSet', 'AssetHashSet', 'MetadataUriSet', 'MetadataHashSet', 'AdditionalInformationSet'];
    const eventInformationPromises: Promise<EventInformation>[] = eventNames.map((event) =>
      this.fetchEventInformationFromLastEvent(tokenId, event),
    );
    const eventInformation: EventInformation[] = await Promise.all(eventInformationPromises);

    const eventInformationWithHighestBlockNumber = eventInformation.reduce(
      (highest, current) => (current && current.blockNumber > highest.blockNumber ? current : highest),
      { blockNumber: -1, transactionHash: '' },
    );

    const timestamp: number = await this.blockchainService.fetchTransactionTimestamp(
      eventInformationWithHighestBlockNumber.transactionHash,
    );
    const timestampInSeconds: Date = new Date(timestamp * 1000);
    return timestampInSeconds.toISOString();
  }

  private async getAllPastEvents(event: string, tokenId: number): Promise<Array<EventLog>> {
    let filter: any;

    if (event === 'Transfer') {
      filter = this.tokenContract.filters.Transfer(null, null, tokenId);
    }

    if (event === 'AssetUriSet') {
      filter = this.tokenContract.filters.AssetUriSet(null, null, null, null, tokenId);
    }

    if (event === 'AssetHashSet') {
      filter = this.tokenContract.filters.AssetHashSet(null, null, null, null, tokenId);
    }

    if (event === 'MetadataUriSet') {
      filter = this.tokenContract.filters.MetadataUriSet(null, null, null, null, tokenId);
    }

    if (event === 'MetadataHashSet') {
      filter = this.tokenContract.filters.MetadataHashSet(null, null, null, null, tokenId);
    }

    if (event === 'AdditionalInformationSet') {
      filter = this.tokenContract.filters.AdditionalInformationSet(null, null, null, null, tokenId);
    }

    return (await this.tokenContract.queryFilter(filter)) as EventLog[];
  }

  private async fetchEventInformationFromLastEvent(tokenId: number, event: string): Promise<EventInformation> {
    const events = await this.getAllPastEvents(event, tokenId);
    return events.length === 0
      ? {
          blockNumber: -1,
          transactionHash: '',
        }
      : {
          blockNumber: events[events.length - 1].blockNumber,
          transactionHash: events[events.length - 1].transactionHash,
        };
  }
}
