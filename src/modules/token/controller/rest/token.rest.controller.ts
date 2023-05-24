/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import TransactionReceipt from 'web3/types';

import { TokenService } from '../../service/token.service';
import { TransferTokenDto } from '../../../../dto/transferToken.dto';
import { GetSegmentDto } from '../../../../dto/getSegment.dto';
import { TokenGetDto, TokenMintDto } from '../../../../dto/token.dto';

@Controller('tokens')
@ApiTags('TokenController')
export class TokenRestController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new token' })
  @ApiBody({ type: TokenMintDto, description: 'Contains all relevant information for the creation of a token' })
  public mintToken(@Body() mintTokenDto: TokenMintDto): Observable<TransactionReceipt> {
    return this.tokenService.mintToken(mintTokenDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns the token with the specified id' })
  @ApiParam({ name: 'id', type: Number })
  public getToken(@Param('id') id: number): Observable<TokenGetDto> {
    return this.tokenService.getToken(String(id));
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
