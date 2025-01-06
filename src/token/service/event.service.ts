/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@nestjs/common';
import { Contract, EventLog, Interface, LogDescription, TransactionReceipt } from 'ethers';

import { BlockchainService } from 'src/shared/blockchain.service';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { TransferEventDto } from '../dto/transfer-event.dto';

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
    private readonly blockchainService: BlockchainService,
    private readonly configurationService: ConfigurationService,
  ) {
    this.tokenContract = this.blockchainService.getContractInstance(
      this.configurationService.getBlockchainConfiguration().tokenAddress,
      this.configurationService.getBlockchainConfiguration().tokenAbi,
    );
  }

  public async fetchTokenInformation(tokenId: number): Promise<TokenInformation> {
    const minterAddress: string = await this.fetchMinterAddress(tokenId);
    const createdOn: string = await this.fetchCreatedOn(tokenId);
    const lastUpdatedOn: string = await this.fetchLastUpdatedOn(tokenId);
    return { minterAddress, createdOn, lastUpdatedOn };
  }

  public async fetchTransferEvents(tokenId: number): Promise<TransferEventDto[]> {
    const events: EventLog[] = await this.getAllPastEvents('Transfer', tokenId);
    return Promise.all(
      events.map(async (event: EventLog): Promise<TransferEventDto> => {
        return new TransferEventDto(
          tokenId,
          //At this point, slice is used to display the sender address and the new owner address in the correct format from the event topics that come back from the blockchain.
          `0x${event.topics[1].slice(26, 66)}`,
          `0x${event.topics[2].slice(26, 66)}`,
          await this.blockchainService.fetchTransactionTimestamp(event.transactionHash),
        );
      }),
    );
  }

  private async fetchMinterAddress(tokenId: number): Promise<string> {
    const events: EventLog[] = await this.getAllPastEvents('Transfer', tokenId);
    return events.length === 0 ? null : events[0].args.to;
  }

  private async fetchCreatedOn(tokenId: number): Promise<string> {
    const events: EventLog[] = await this.getAllPastEvents('Transfer', tokenId);
    const transactionHash: string = events.length === 0 ? '' : events[0].transactionHash;

    return this.blockchainService.fetchTransactionTimestamp(transactionHash);
  }

  private async fetchLastUpdatedOn(tokenId: number): Promise<string> {
    const eventNames = ['AssetUriSet', 'AssetHashSet', 'MetadataUriSet', 'MetadataHashSet', 'AdditionalDataSet'];
    const eventInformationPromises: Promise<EventInformation>[] = eventNames.map((event) =>
      this.fetchEventInformationFromLastEvent(tokenId, event),
    );
    const eventInformation: EventInformation[] = await Promise.all(eventInformationPromises);

    const eventInformationWithHighestBlockNumber = eventInformation.reduce(
      (highest, current) => (current && current.blockNumber > highest.blockNumber ? current : highest),
      { blockNumber: -1, transactionHash: '' },
    );

    return await this.blockchainService.fetchTransactionTimestamp(
      eventInformationWithHighestBlockNumber.transactionHash,
    );
  }

  private async getAllPastEvents(event: string, tokenId: number): Promise<EventLog[]> {
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

    if (event === 'AdditionalDataSet') {
      filter = this.tokenContract.filters.AdditionalDataSet(null, null, null, null, tokenId);
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

  public decodeLogs(
    contractInterface: Interface,
    transactionReceipt: TransactionReceipt,
    eventNames: string[],
  ): LogDescription[] {
    const decodedLogs: LogDescription[] = transactionReceipt?.logs
      ? transactionReceipt.logs
          .map((encodedLog: any) => {
            const decodedLog = contractInterface.parseLog(encodedLog);
            return eventNames.includes(decodedLog.name) ? decodedLog : null;
          })
          .filter((decodedLog: any) => {
            return decodedLog !== null && decodedLog !== undefined;
          })
      : [];

    if (decodedLogs.length === 0) {
      throw new Error(`No event found in transaction receipt logs. Event names: ${eventNames.join(', ')}`);
    }

    return decodedLogs;
  }
}
