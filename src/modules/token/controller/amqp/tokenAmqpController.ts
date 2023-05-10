/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TokenService } from '../../service/token.service';
import { TokenMintDto } from '../../../../dto/tokenMint.dto';
import { handleException } from '../../../utils/errorHandling';

@Controller()
export class TokenAmqpController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('approve')
  public approve(@Payload() queryInput: any) {
    return this.tokenService.approve(queryInput.to, queryInput.tokenId);
  }

  @MessagePattern('burn')
  public burn(@Payload() queryInput: any) {
    return this.tokenService.burn(queryInput.tokenId);
  }

  @MessagePattern('renounceOwnership')
  public renounceOwnership() {
    return this.tokenService.renounceOwnership();
  }

  @MessagePattern('safeMint')
  public safeMint(@Payload() tokenMintDto: TokenMintDto) {
    return this.tokenService.safeMint(tokenMintDto);
  }

  @MessagePattern('safeTransferFrom')
  public safeTransferFrom(@Payload() queryInput: any) {
    return this.tokenService.safeTransferFrom(queryInput.from, queryInput.to, queryInput.tokenId);
  }

  @MessagePattern('setApprovalForAll')
  public setApprovalForAll(@Payload() queryInput: any) {
    return this.tokenService.setApprovalForAll(queryInput.operator, queryInput.approved);
  }

  @MessagePattern('transferFrom')
  public transferFrom(@Payload() queryInput: any) {
    return this.tokenService.transferFrom(queryInput.from, queryInput.to, queryInput.tokenId);
  }

  @MessagePattern('transferOwnership')
  public transferOwnership(@Payload() queryInput: any) {
    return this.tokenService.transferOwnership(queryInput.newOwner);
  }

  @MessagePattern('balanceOf')
  public balanceOf(@Payload() queryInput: any) {
    return this.tokenService.balanceOf(queryInput.ownerAddress);
  }

  @MessagePattern('getAdditionalInformation')
  public getAdditionalInformation(@Payload() queryInput: any) {
    return this.tokenService.getAdditionalInformation(queryInput.tokenId);
  }

  @MessagePattern('getApproved')
  public getApproved(@Payload() queryInput: any) {
    return this.tokenService.getApproved(queryInput.tokenId);
  }

  @MessagePattern('getAssetInformation')
  public getAssetInformation(@Payload() queryInput: any) {
    return handleException(this.tokenService.getAssetInformation(queryInput.tokenId));
  }

  @MessagePattern('getAssetHash')
  public getAssetHash(@Payload() queryInput: any) {
    return this.tokenService.getAssetHash(queryInput.tokenId);
  }

  @MessagePattern('getAssetUri')
  public getAssetUri(@Payload() queryInput: any) {
    return this.tokenService.getAssetUri(queryInput.tokenId);
  }

  @MessagePattern('getMetadataHash')
  public getMetadataHash(@Payload() queryInput: any) {
    return this.tokenService.getMetadataHash(queryInput.tokenId);
  }

  @MessagePattern('isApprovedForAll')
  public isApprovedForAll(@Payload() queryInput: any) {
    return this.tokenService.isApprovedForAll(queryInput.owner, queryInput.operator);
  }

  @MessagePattern('name')
  public name() {
    return this.tokenService.name();
  }

  @MessagePattern('owner')
  public owner() {
    return this.tokenService.owner();
  }

  @MessagePattern('ownerOf')
  public ownerOf(@Payload() queryInput: any) {
    return this.tokenService.ownerOf(queryInput.tokenId);
  }

  @MessagePattern('supportsInterface')
  public supportsInterface(@Payload() queryInput: any) {
    return this.tokenService.supportsInterface(queryInput.interfaceId);
  }

  @MessagePattern('symbol')
  public symbol() {
    return this.tokenService.symbol();
  }

  @MessagePattern('getTokenURI')
  public getTokenURI(@Payload() queryInput: any) {
    return this.tokenService.getTokenURI(queryInput.tokenId);
  }
}
