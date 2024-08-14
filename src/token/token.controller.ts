/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import TransactionReceipt from 'web3/types';

import { TokenService } from './token.service';
import { BlockchainService } from '../shared/blockchain.service';
import { TokenGetDto, TokenMintDto, TokenUpdateDto } from './dto/token.dto';
import { SegmentReadDto } from '../segment/dto/segment.read.dto';

@Controller('tokens')
@ApiTags('Tokens')
export class TokenRestController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly blockchainService: BlockchainService,
  ) {}

  @Post()
  @ApiBody({
    type: TokenMintDto,
    description: 'Contains all relevant information for the creation of a token',
  })
  @ApiOperation({
    summary: 'Creates a new token',
  })
  @ApiCreatedResponse({
    description: 'The Token has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'The input does not have the correct format or a token with this remoteId already exists.',
  })
  public mintToken(@Body() dto: TokenMintDto): Promise<TransactionReceipt> {
    const dtoWithDefaultValues = TokenMintDto.createWithDefaultValues();
    Object.assign(dtoWithDefaultValues, dto);
    return this.tokenService.mintToken(dtoWithDefaultValues);
  }

  @Get()
  @ApiQuery({
    name: 'tokenId',
    type: Number,
    required: false,
    description: 'The id of the Token to be returned',
  })
  @ApiQuery({
    name: 'remoteId',
    type: String,
    required: false,
    description: 'The remoteId of the Token to be returned',
  })
  @ApiOperation({
    summary: 'Returns the token with the specified tokenId or remoteId',
  })
  @ApiOkResponse({
    description: 'The token for the specified tokenId or remoteId',
    type: TokenGetDto,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'A token with the specified tokenId or remoteId does not exist.',
  })
  public async getToken(
    @Query('tokenId') tokenId?: number,
    @Query('remoteId') remoteId?: string,
  ): Promise<TokenGetDto> {
    if (tokenId) {
      return this.tokenService.getTokenByTokenId(tokenId);
    } else if (remoteId) {
      return await this.tokenService.getTokenByRemoteId(remoteId);
    } else {
      const errorMessage = { message: 'Neither a tokenId nor a remoteId was specified' };
      this.blockchainService.handleError(errorMessage);
      return Promise.reject(errorMessage);
    }
  }

  @Get(':tokenId/segments')
  @ApiParam({
    name: 'tokenId',
    type: Number,
    description: 'The id of the token whose segments are to be returned',
  })
  @ApiOperation({
    summary: 'Returns all segments which contain the specific token',
  })
  @ApiOkResponse({
    description: 'The list of segments that contain the specified token',
    type: SegmentReadDto,
    isArray: true,
  })
  public getAllSegments(@Param('tokenId') tokenId: number): Promise<SegmentReadDto[]> {
    return this.tokenService.getAllSegments(tokenId);
  }

  @Patch(':remoteId')
  @ApiBody({
    type: TokenUpdateDto,
    description: 'Contains the new properties of the Token',
  })
  @ApiOperation({
    summary: 'Updates the token with the specified tokenId or remoteId',
  })
  @ApiOkResponse({
    description: 'The Token has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'A token with the specified remoteId does not exist.',
  })
  public updateToken(@Param('remoteId') remoteId: string, @Body() dto: TokenUpdateDto): Promise<TransactionReceipt> {
    return this.tokenService.updateToken(remoteId, dto);
  }

  @Delete(':tokenId')
  @ApiParam({
    name: 'tokenId',
    type: Number,
    description: 'The id of the Token to be burned',
  })
  @ApiOperation({
    summary: 'Burns the token with the specified id',
  })
  @ApiOkResponse({
    description: 'The Token has been successfully burned.',
  })
  @ApiNotFoundResponse({
    description:
      'A token with the specified remoteId does not exist or the current user is not the owner of the token with the specified id.',
  })
  public burnToken(@Param('tokenId') tokenId: number): Promise<TransactionReceipt> {
    return this.tokenService.burnToken(tokenId);
  }
}
