/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { TokenMintDto } from '../../../dto/tokenMint.dto';
import { BlockchainConnectorService } from '../../blockchain-connector/blockchain-connector.service';
import { ApiConfigService } from '../../../config/apiConfig.service';
import { Injectable } from '@nestjs/common';
import { TokenAbi } from './token.abi';
import { Observable } from 'rxjs';
import { ErrorDto } from '../../../dto/error.dto';

@Injectable()
export class TokenService {
  private contract: any;

  constructor(
    private readonly blockchainConnectorService: BlockchainConnectorService,
    private apiConfigService: ApiConfigService,
  ) {
    this.contract = new this.blockchainConnectorService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_ADDRESS);
  }

  public approve(to: string, tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.approve(to, tokenId));
  }

  public burn(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.burn(tokenId));
  }

  public renounceOwnership(): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.renounceOwnership());
  }

  public safeMint(tokenMintDto: TokenMintDto): Observable<any | ErrorDto> {
    const transaction = tokenMintDto.additionalInformation
      ? this.contract.methods.safeMint(
          tokenMintDto.receiver,
          tokenMintDto.assetUri,
          tokenMintDto.assetHash,
          tokenMintDto.metadataUri,
          tokenMintDto.metadataHash,
          tokenMintDto.additionalInformation,
        )
      : this.contract.methods.safeMint(
          tokenMintDto.receiver,
          tokenMintDto.assetUri,
          tokenMintDto.assetHash,
          tokenMintDto.metadataUri,
          tokenMintDto.metadataHash,
        );
    return this.blockchainConnectorService.sendTransaction(transaction);
  }

  public safeTransferFrom(from: string, to: string, tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.safeTransferFrom(from, to, tokenId));
  }

  public setApprovalForAll(operator: string, approved: boolean): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.setApprovalForAll(operator, approved));
  }

  public transferFrom(from: string, to: string, tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.transferFrom(from, to, tokenId));
  }

  public transferOwnership(newOwner: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.sendTransaction(this.contract.methods.transferOwnership(newOwner));
  }

  public balanceOf(ownerAddress: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.balanceOf(ownerAddress));
  }

  public getAdditionalInformation(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getAdditionalInformation(tokenId));
  }

  public getApproved(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getApproved(tokenId));
  }

  public getAssetInformation(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getAssetInformation(tokenId));
  }

  public getAssetHash(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getAssetHash(tokenId));
  }

  public getAssetUri(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getAssetUri(tokenId));
  }

  public getMetadataHash(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.getMetadataHash(tokenId));
  }

  public isApprovedForAll(owner: string, operator: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.isApprovedForAll(owner, operator));
  }

  public name(): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.name());
  }

  public owner(): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.owner());
  }

  public ownerOf(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.ownerOf(tokenId));
  }

  public supportsInterface(interfaceId: string): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.supportsInterface(interfaceId));
  }

  public symbol(): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.symbol());
  }

  public getTokenURI(tokenId: number): Observable<any | ErrorDto> {
    return this.blockchainConnectorService.call(this.contract.methods.tokenURI(tokenId));
  }
}
