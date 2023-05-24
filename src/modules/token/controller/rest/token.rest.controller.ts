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

import { TokenService } from '../../service/token.service';
import { TransferTokenDto } from '../../../../dto/transferToken.dto';
import { GetSegmentDto } from '../../../../dto/getSegment.dto';
import { TokenGetDto, TokenMintDto } from '../../../../dto/token.dto';
import { BlockchainService } from '../../../blockchain/service/blockchain.service';

@Controller('tokens')
@ApiTags('TokenController')
export class TokenRestController {
  constructor(private readonly tokenService: TokenService, private readonly blockchainService: BlockchainService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new token' })
  @ApiBody({ type: TokenMintDto, description: 'Contains all relevant information for the creation of a token' })
  public mintToken(@Body() mintTokenDto: TokenMintDto): Observable<TransactionReceipt> {
    return this.tokenService.mintToken(mintTokenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns the token with the specified tokenId or remoteId' })
  @ApiQuery({ name: 'tokenId', type: Number, required: false })
  @ApiQuery({ name: 'remoteId', type: String, required: false })
  public getToken(@Query('tokenId') tokenId?: number, @Query('remoteId') remoteId?: string): Observable<TokenGetDto> {
    if (tokenId) {
      return this.tokenService.getTokenByTokenId(String(tokenId));
    } else if (remoteId) {
      return this.tokenService.getTokenByRemoteId(remoteId);
    } else {
      this.blockchainService.handleError({ message: 'Neither a tokenId nor a remoteId was specified' });
    }
  }

  @Get(':id/segments')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Returns all segments which contain the specific token' })
  public getAllSegments(@Param('id') tokenId: number): Observable<GetSegmentDto[]> {
    return this.tokenService.getAllSegments(String(tokenId));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Burns the token with the specified id' })
  @ApiParam({ name: 'id', type: Number })
  public burnToken(@Param('id') id: number): Observable<TransactionReceipt> {
    return this.tokenService.burnToken(String(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Transfers the token with the specified id from the current owner to a new owner' })
  @ApiBody({ type: TransferTokenDto, description: 'Contains the address of the current and new owner' })
  public transferToken(@Param('id') id: number, @Body() transferDto: TransferTokenDto): Observable<TransactionReceipt> {
    return this.tokenService.transferToken(String(id), transferDto.fromAddress, transferDto.toAddress);
  }
}
