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

@Injectable()
export class EventService {
  private tokenContract: any;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly blockchainService: BlockchainService,
  ) {
    this.tokenContract = new this.blockchainService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public async getMinterAddressAndLastUpdatedOn(
    tokenId: number,
  ): Promise<{ minterAddress: string; lastUpdatedOn: string }> {
    const minterAddress: string = await this.fetchMinterAddress(tokenId);
    const lastUpdatedOn = await this.fetchLastUpdatedOn(tokenId);
    return { minterAddress, lastUpdatedOn };
  }

  private async fetchMinterAddress(tokenId: number): Promise<string> {
    const transferEvents: any[] = await this.tokenContract.getPastEvents('Transfer', {
      filter: { tokenId },
      fromBlock: 'genesis',
      toBlock: 'latest',
    });

    if (transferEvents.length === 0) {
      return null;
    }

    return transferEvents[0].returnValues.to;
  }

  private async fetchLastUpdatedOn(tokenId: number) {
    const eventNames = ['AssetUriSet', 'AssetHashSet', 'MetadataUriSet', 'MetadataHashSet', 'AdditionalInformationSet'];
    const eventInformationPromises = eventNames.map((event) => this.fetchInformationOfLastEvent(tokenId, event));
    const eventInformation = await Promise.all(eventInformationPromises);

    const eventInformationWithHighestBlockNumber = eventInformation.reduce(
      (highest, current) => (current && current.blockNumber > highest.blockNumber ? current : highest),
      { blockNumber: -1, transactionHash: '' },
    );

    const timestamp: number = await this.blockchainService.fetchTransactionTimestamp(
      eventInformationWithHighestBlockNumber.transactionHash,
    );
    const timestampInSeconds = new Date(timestamp * 1000);
    return timestampInSeconds.toISOString();
  }

  private async fetchInformationOfLastEvent(tokenId: number, event: string): Promise<EventInformation> {
    const events: any[] = await this.tokenContract.getPastEvents(event, {
      filter: { tokenId },
      fromBlock: 'genesis',
      toBlock: 'latest',
    });

    if (events.length === 0) {
      return {
        blockNumber: -1,
        transactionHash: '',
      };
    }

    return {
      blockNumber: events[events.length - 1].blockNumber,
      transactionHash: events[events.length - 1].transactionHash,
    };
  }
}
