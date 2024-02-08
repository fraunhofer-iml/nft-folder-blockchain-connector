/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';

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
  private tokenContract: any;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly blockchainService: BlockchainService,
  ) {
    this.tokenContract = new this.blockchainService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public async fetchTokenInformation(tokenId: number): Promise<TokenInformation> {
    const minterAddress: string = await this.fetchMinterAddress(tokenId);
    const createdOn: string = await this.fetchCreatedOn(tokenId);
    const lastUpdatedOn: string = await this.fetchLastUpdatedOn(tokenId);
    return { minterAddress, createdOn, lastUpdatedOn };
  }

  private async fetchMinterAddress(tokenId: number): Promise<string> {
    const events = await this.getAllPastEvents('Transfer', tokenId);
    return events.length === 0 ? null : events[0].returnValues.to;
  }

  private async getAllPastEvents(event: string, tokenId: number): Promise<any> {
    return await this.tokenContract.getPastEvents(event, {
      filter: { tokenId },
      fromBlock: 'genesis',
      toBlock: 'latest',
    });
  }

  private async fetchCreatedOn(tokenId: number): Promise<string> {
    const transactionHash: string = await this.fetchTransactionHashFromFirstTransferEvent(tokenId);
    const timestamp: number = await this.blockchainService.fetchTransactionTimestamp(transactionHash);
    const timestampInSeconds: Date = new Date(timestamp * 1000);
    return timestampInSeconds.toISOString();
  }

  private async fetchTransactionHashFromFirstTransferEvent(tokenId: number): Promise<string> {
    const events = await this.getAllPastEvents('Transfer', tokenId);
    return events.length === 0 ? '' : events[0].transactionHash;
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
