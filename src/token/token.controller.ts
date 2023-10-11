/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import TransactionReceipt from 'web3/types';

import { TokenService } from './token.service';
import { BlockchainService } from '../shared/blockchain.service';

import { TokenGetDto, TokenMintDto, TokenUpdateDto } from './dto/token.dto';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';

@Controller('tokens')
@ApiTags('TokenController')
export class TokenRestController {
  constructor(private readonly tokenService: TokenService, private readonly blockchainService: BlockchainService) {}

  @Get()
  @ApiOperation({ summary: 'Returns the token with the specified tokenId or remoteId' })
  @ApiQuery({ name: 'tokenId', type: Number, required: false })
  @ApiQuery({ name: 'remoteId', type: String, required: false })
  public getToken(@Query('tokenId') tokenId?: number, @Query('remoteId') remoteId?: string): Observable<TokenGetDto> {
    if (tokenId) {
      return this.tokenService.getTokenByTokenId(tokenId);
    } else if (remoteId) {
      return this.tokenService.getTokenByRemoteId(remoteId);
    } else {
      this.blockchainService.handleError({ message: 'Neither a tokenId nor a remoteId was specified' });
    }
  }

  @Get(':tokenId/segments')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns all segments which contain the specific token' })
  public getAllSegments(@Param('tokenId') tokenId: number): Observable<SegmentReadDto[]> {
    return this.tokenService.getAllSegments(String(tokenId));
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new token' })
  @ApiBody({ type: TokenMintDto, description: 'Contains all relevant information for the creation of a token' })
  public mintToken(@Body() dto: TokenMintDto): Observable<TransactionReceipt> {
    const dtoWithDefaultValues = TokenMintDto.createWithDefaultValues();
    Object.assign(dtoWithDefaultValues, dto);
    return this.tokenService.mintToken(dtoWithDefaultValues);
  }

  @Patch(':remoteId')
  @ApiOperation({ summary: 'Updates the token with the specified tokenId or remoteId' })
  @ApiBody({ type: TokenUpdateDto, description: 'Contains the payload' })
  public updateToken(@Param('remoteId') remoteId: string, @Body() dto: TokenUpdateDto): Observable<TransactionReceipt> {
    return this.tokenService.updateToken(remoteId, dto);
  }

  @Delete(':tokenId')
  @ApiOperation({ summary: 'Burns the token with the specified id' })
  @ApiParam({ name: 'tokenId', type: Number })
  public burnToken(@Param('tokenId') tokenId: number): Observable<TransactionReceipt> {
    return this.tokenService.burnToken(String(tokenId));
  }
}
