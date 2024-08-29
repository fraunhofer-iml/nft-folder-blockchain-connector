/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

import { TokenCreateService } from './token-create.service';
import { TokenReadService } from './token-read.service';
import { TokenUpdateService } from './token-update.service';
import { TokenDeleteService } from './token-delete.service';
import TokenCreateDto from './dto/token-create.dto';
import TokenReadDto from './dto/token-read.dto';
import TokenUpdateDto from './dto/token-update.dto';
import { SegmentReadDto } from 'src/segment/dto/segment.read.dto';

@Controller('tokens')
@ApiTags('Tokens')
export class TokenRestController {
  constructor(
    private readonly tokenCreateService: TokenCreateService,
    private readonly tokenReadService: TokenReadService,
    private readonly tokenUpdateService: TokenUpdateService,
    private readonly tokenDeleteService: TokenDeleteService,
  ) {}

  @Post()
  @ApiBody({
    type: TokenCreateDto,
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
  public createToken(@Body() dto: TokenCreateDto): Promise<TokenReadDto> {
    const dtoWithDefaultValues = TokenCreateDto.createWithDefaultValues();
    Object.assign(dtoWithDefaultValues, dto);
    return this.tokenCreateService.createToken(dtoWithDefaultValues);
  }

  @Get()
  @ApiOperation({
    summary: 'Returns all tokens that correspond to the provided remoteId or ownerAddress or a combination of both',
  })
  @ApiOkResponse({
    description: 'The found tokens',
    type: TokenReadDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'remoteId',
    type: String,
    required: false,
    description: 'The remoteId of the tokens to be returned',
  })
  public async getTokensByRemoteIdAndOwner(@Query('remoteId') remoteId?: string): Promise<TokenReadDto[]> {
    return await this.tokenReadService.getTokensByRemoteIdAndOwner(remoteId);
  }

  @Get(':tokenId')
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: false,
    description: 'The id of the Token to be returned',
  })
  @ApiOperation({
    summary: 'Returns the token with the specified tokenId or remoteId',
  })
  @ApiOkResponse({
    description: 'The token for the specified tokenId or remoteId',
    type: TokenReadDto,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'A token with the specified tokenId does not exist.',
  })
  public async getTokenByTokenId(@Param('tokenId') tokenId: string): Promise<TokenReadDto> {
    const parsedTokenId = this.parseTokenId(tokenId);
    return this.tokenReadService.getTokenByTokenId(parsedTokenId);
  }

  @Get(':tokenId/segments')
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token whose segments to be returned',
  })
  @ApiOperation({
    summary: 'Returns all segments which contain the specific token',
  })
  @ApiOkResponse({
    description: 'The list of segments that contain the specified token',
    type: SegmentReadDto,
    isArray: true,
  })
  public getSegmentsByTokenId(@Param('tokenId') tokenId: string): Promise<SegmentReadDto[]> {
    const parsedTokenId = this.parseTokenId(tokenId);
    return this.tokenReadService.getSegmentsByTokenId(parsedTokenId);
  }

  @Patch(':tokenId')
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token to be updated',
  })
  @ApiBody({
    type: TokenUpdateDto,
    description: 'Contains the new properties of the Token',
  })
  @ApiOperation({
    summary: 'Updates the token with the specified tokenId',
  })
  @ApiOkResponse({
    description: 'The Token has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'A token with the specified tokenId does not exist.',
  })
  public updateTokenByTokenId(@Param('tokenId') tokenId: string, @Body() dto: TokenUpdateDto): Promise<TokenReadDto> {
    const parsedTokenId = this.parseTokenId(tokenId);
    return this.tokenUpdateService.updateTokenByTokenId(parsedTokenId, dto);
  }

  @Delete(':tokenId')
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the Token to be burned',
  })
  @ApiOperation({
    summary: 'Burns the token with the specified tokenId',
  })
  @ApiOkResponse({
    description: 'The Token has been successfully burned.',
  })
  @ApiNotFoundResponse({
    description:
      'A token with the specified remoteId does not exist or the current user is not the owner of the token with the specified tokenId.',
  })
  public burnTokenByTokenId(@Param('tokenId') tokenId: string): Promise<void> {
    const parsedTokenId = this.parseTokenId(tokenId);
    return this.tokenDeleteService.burnTokenByTokenId(parsedTokenId);
  }

  private parseTokenId(tokenId: string) {
    const parsedTokenId = Number(tokenId);

    if (isNaN(parsedTokenId) || parsedTokenId < 0) {
      throw new BadRequestException('Invalid tokenId provided. It must be a positive integer.');
    }

    return parsedTokenId;
  }
}
