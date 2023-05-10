/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { TokenService } from '../../service/token.service';
import { TokenMintDto } from '../../../../dto/tokenMint.dto';
import { ApprovalDto } from '../../../../dto/approval.dto';
import { TransferDto } from '../../../../dto/transfer.dto';
import { handleException } from '../../../utils/errorHandling';

@ApiTags('TokenRestController')
@Controller('token')
export class TokenRestController {
  constructor(private readonly tokenService: TokenService) {}

  @Put('approve')
  @ApiBody({ type: ApprovalDto, description: 'Contains the information for a token approval' })
  @ApiOperation({ summary: 'Approve a token' })
  public approve(@Body() approvalDto: ApprovalDto) {
    if (!approvalDto.to || !approvalDto.tokenId) {
      throw new BadRequestException();
    }
    return handleException(this.tokenService.approve(approvalDto.to, approvalDto.tokenId));
  }

  @Delete('burn/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Burn a token' })
  public burn(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.burn(tokenId));
  }

  @Put('renounceOwnership')
  @ApiOperation({ summary: 'Renounce ownership' })
  public renounceOwnership() {
    return handleException(this.tokenService.renounceOwnership());
  }

  @Post('safeMint')
  @ApiBody({ type: TokenMintDto, description: 'tokenMintDto' })
  @ApiOperation({ summary: 'Mint the token' })
  public safeMint(@Body() tokenMintDto: TokenMintDto) {
    return handleException(this.tokenService.safeMint(tokenMintDto));
  }

  @Put('safeTransferFrom')
  @ApiBody({ type: TransferDto, description: 'contains the necessary information about a token transfer' })
  @ApiOperation({ summary: '(Safe) Transfer token' })
  public safeTransferFrom(@Body() transferDto: TransferDto) {
    return handleException(this.tokenService.safeTransferFrom(transferDto.from, transferDto.from, transferDto.tokenId));
  }

  @Put('setApprovalForAll/:operator/:approved')
  @ApiParam({ name: 'operator', type: String })
  @ApiParam({ name: 'approved', type: Boolean })
  @ApiOperation({ summary: 'Set Approval' })
  public setApprovalForAll(@Param('operator') operator: string, @Param('approved') approved: boolean) {
    return handleException(this.tokenService.setApprovalForAll(operator, approved));
  }

  @Put('transferFrom')
  @ApiBody({ type: TransferDto, description: 'contains the necessary information about a token transfer' })
  @ApiOperation({ summary: 'Transfer token' })
  public transferFrom(@Body() transferDto: TransferDto) {
    return handleException(this.tokenService.transferFrom(transferDto.from, transferDto.to, transferDto.tokenId));
  }

  @Put('transferOwnership/:newOwner')
  @ApiParam({ name: 'newOwner', type: String })
  @ApiOperation({ summary: 'Transfer token ownership' })
  public transferOwnership(@Param('newOwner') newOwner: string) {
    return handleException(this.tokenService.transferOwnership(newOwner));
  }

  @Get('balanceOf/:ownerAddress')
  @ApiParam({ name: 'ownerAddress', type: String })
  @ApiOperation({ summary: 'Returns balance' })
  public balanceOf(@Param('ownerAddress') ownerAddress: string) {
    return handleException(this.tokenService.balanceOf(ownerAddress));
  }

  @Get('getAdditionalInformation/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns additional info of token' })
  public getAdditionalInformation(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getAdditionalInformation(tokenId));
  }

  @Get('getApproved/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns if the token is approved' })
  public getApproved(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getApproved(tokenId));
  }

  @Get('getAssetInformation/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token asset information' })
  public getAssetInformation(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getAssetInformation(tokenId));
  }

  @Get('getAssetHash/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token asset hash' })
  public getAssetHash(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getAssetHash(tokenId));
  }

  @Get('getAssetUri/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token asset uri' })
  public getAssetUri(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getAssetUri(tokenId));
  }

  @Get('getMetadataHash/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the metadata hash of the token' })
  public getMetadataHash(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getMetadataHash(tokenId));
  }

  @Get('isApprovedForAll/:owner/:operator')
  @ApiParam({ name: 'owner', type: String })
  @ApiParam({ name: 'operator', type: String })
  @ApiOperation({ summary: 'Returns if the owner is approved for all tokens' })
  public isApprovedForAll(@Param('owner') owner: string, @Param('operator') operator: string) {
    return handleException(this.tokenService.isApprovedForAll(owner, operator));
  }

  @Get('name')
  @ApiOperation({ summary: 'Returns the name' })
  public name() {
    return handleException(this.tokenService.name());
  }

  @Get('owner')
  @ApiOperation({ summary: 'Returns the owner' })
  public owner() {
    return handleException(this.tokenService.owner());
  }

  @Get('ownerOf/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns if the owner of the token' })
  public ownerOf(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.ownerOf(tokenId));
  }

  @Get('supportsInterface/:interfaceId')
  @ApiParam({ name: 'interfaceId', type: String })
  @ApiOperation({ summary: 'Returns if the interface is supported' })
  public supportsInterface(@Param('interfaceId') interfaceId: string) {
    return handleException(this.tokenService.supportsInterface(interfaceId));
  }

  @Get('symbol')
  @ApiOperation({ summary: 'Returns the symbol' })
  public symbol() {
    return handleException(this.tokenService.symbol());
  }

  @Get('getTokenURI/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token uri' })
  public getTokenURI(@Param('tokenId') tokenId: number) {
    return handleException(this.tokenService.getTokenURI(tokenId));
  }
}
