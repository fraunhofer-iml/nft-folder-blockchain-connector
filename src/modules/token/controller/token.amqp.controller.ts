/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokenService } from '../service/token.service';
import { TokenMintDto } from '../../../dto/tokenMint.dto';

@Controller()
export class TokenAMQPController {
  constructor(private readonly tokenConnectorService: TokenService) {}

  @MessagePattern('approve')
  public approve(@Payload() queryInput: any) {
    return this.tokenConnectorService.approve(queryInput.to, queryInput.tokenId);
  }

  @MessagePattern('burn')
  public burn(@Payload() queryInput: any) {
    return this.tokenConnectorService.burn(queryInput.tokenId);
  }

  @MessagePattern('renounceOwnership')
  public renounceOwnership() {
    return this.tokenConnectorService.renounceOwnership();
  }

  @MessagePattern('safeMint')
  public safeMint(@Payload() tokenMintDto: TokenMintDto) {
    return this.tokenConnectorService.safeMint(tokenMintDto);
  }

  @MessagePattern('safeTransferFrom')
  public safeTransferFrom(@Payload() queryInput: any) {
    return this.tokenConnectorService.safeTransferFrom(queryInput.from, queryInput.to, queryInput.tokenId);
  }

  @MessagePattern('setApprovalForAll')
  public setApprovalForAll(@Payload() queryInput: any) {
    return this.tokenConnectorService.setApprovalForAll(queryInput.operator, queryInput.approved);
  }

  @MessagePattern('transferFrom')
  public transferFrom(@Payload() queryInput: any) {
    return this.tokenConnectorService.transferFrom(queryInput.from, queryInput.to, queryInput.tokenId);
  }

  @MessagePattern('transferOwnership')
  public transferOwnership(@Payload() queryInput: any) {
    return this.tokenConnectorService.transferOwnership(queryInput.newOwner);
  }

  @MessagePattern('balanceOf')
  public balanceOf(@Payload() queryInput: any) {
    return this.tokenConnectorService.balanceOf(queryInput.ownerAddress);
  }

  @MessagePattern('getAdditionalInformation')
  public getAdditionalInformation(@Payload() queryInput: any) {
    return this.tokenConnectorService.getAdditionalInformation(queryInput.tokenId);
  }

  @MessagePattern('getApproved')
  public getApproved(@Payload() queryInput: any) {
    return this.tokenConnectorService.getApproved(queryInput.tokenId);
  }

  @MessagePattern('getAssetHash')
  public getAssetHash(@Payload() queryInput: any) {
    return this.tokenConnectorService.getAssetHash(queryInput.tokenId);
  }

  @MessagePattern('getAssetUri')
  public getAssetUri(@Payload() queryInput: any) {
    return this.tokenConnectorService.getAssetUri(queryInput.tokenId);
  }

  @MessagePattern('getMetadataHash')
  public getMetadataHash(@Payload() queryInput: any) {
    return this.tokenConnectorService.getMetadataHash(queryInput.tokenId);
  }

  @MessagePattern('isApprovedForAll')
  public isApprovedForAll(@Payload() queryInput: any) {
    return this.tokenConnectorService.isApprovedForAll(queryInput.owner, queryInput.operator);
  }

  @MessagePattern('name')
  public name() {
    return this.tokenConnectorService.name();
  }

  @MessagePattern('owner')
  public owner() {
    return this.tokenConnectorService.owner();
  }

  @MessagePattern('ownerOf')
  public ownerOf(@Payload() queryInput: any) {
    return this.tokenConnectorService.ownerOf(queryInput.tokenId);
  }

  @MessagePattern('supportsInterface')
  public supportsInterface(@Payload() queryInput: any) {
    return this.tokenConnectorService.supportsInterface(queryInput.interfaceId);
  }

  @MessagePattern('symbol')
  public symbol() {
    return this.tokenConnectorService.symbol();
  }

  @MessagePattern('getTokenURI')
  public getTokenURI(@Payload() queryInput: any) {
    return this.tokenConnectorService.getTokenURI(queryInput.tokenId);
  }
}
