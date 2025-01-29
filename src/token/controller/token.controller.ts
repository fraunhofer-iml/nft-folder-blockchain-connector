/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { TokenMintService } from '../service/token-mint.service';
import { TokenReadService } from '../service/token-read.service';
import { TokenUpdateService } from '../service/token-update.service';
import { TokenBurnService } from '../service/token-burn.service';
import { TokenMintDto } from '../dto/token-mint.dto';
import { TokenReadDto } from '../dto/token-read.dto';
import { TokenUpdateDto } from '../dto/token-update.dto';
import { SegmentReadDto } from 'src/segment/dto/segment.read.dto';
import { TokenTransferDto } from '../dto/token-transfer.dto';
import { TransferEventDto } from '../dto/transfer-event.dto';

enum Status {
  Confirmed = 'confirmed',
  Unconfirmed = 'unconfirmed',
}

@Controller('tokens')
@ApiTags('Tokens')
export class TokenController {
  constructor(
    private readonly tokenMintService: TokenMintService,
    private readonly tokenReadService: TokenReadService,
    private readonly tokenUpdateService: TokenUpdateService,
    private readonly tokenBurnService: TokenBurnService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: TokenMintDto,
    description: 'Contains all relevant information for the creation of a token',
  })
  @ApiQuery({
    name: 'appendToHierarchy',
    type: Boolean,
    required: true,
    description: 'Whether the token should be appended to a hierarchy or not',
  })
  public async mintToken(
    @Body() dto: TokenMintDto,
    @Query('appendToHierarchy') appendToHierarchy: string,
  ): Promise<TokenReadDto> {
    return this.tokenMintService.mintToken(dto, appendToHierarchy === 'true');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'remoteId',
    type: String,
    required: false,
    description: 'The remoteId of the tokens to be returned',
  })
  public async getTokens(@Query('remoteId') remoteId?: string): Promise<TokenReadDto[]> {
    return this.tokenReadService.getTokens(remoteId);
  }

  @Get(':tokenId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the Token to be returned',
  })
  public async getToken(@Param('tokenId') tokenId: string): Promise<TokenReadDto> {
    const parsedTokenId = this.parseId(tokenId);
    return this.tokenReadService.getToken(parsedTokenId);
  }

  @Get(':tokenId/events/transfers')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token whose transfer events are to be returned.',
  })
  public async getTokenTransferEvents(@Param('tokenId') tokenId: string): Promise<TransferEventDto[]> {
    const parsedTokenId: number = this.parseId(tokenId);
    return this.tokenReadService.getTokenTransferEvents(parsedTokenId);
  }

  @Get(':tokenId/parents')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token whose parent ids are to be returned',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: true,
    enum: Status,
    description: `The status of the parent ids to be returned ('${Status.Confirmed}' or '${Status.Unconfirmed}')`,
  })
  public async getParentIds(@Param('tokenId') tokenId: string, @Query('status') status: Status): Promise<number[]> {
    this.validateStatus(status);
    const parsedTokenId: number = this.parseId(tokenId);
    return this.tokenReadService.getParentIds(parsedTokenId, status === Status.Confirmed);
  }

  @Get(':tokenId/children')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token whose child ids are to be returned',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: true,
    enum: Status,
    description: `The status of the child ids to be returned ('${Status.Confirmed}' or '${Status.Unconfirmed}')`,
  })
  public async getChildIds(@Param('tokenId') tokenId: string, @Query('status') status: Status): Promise<number[]> {
    this.validateStatus(status);
    const parsedTokenId: number = this.parseId(tokenId);
    return this.tokenReadService.getChildIds(parsedTokenId, status === Status.Confirmed);
  }

  @Get(':tokenId/segments')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token whose segments to be returned',
  })
  public async getSegments(@Param('tokenId') tokenId: string): Promise<SegmentReadDto[]> {
    const parsedTokenId = this.parseId(tokenId);
    return this.tokenReadService.getSegments(parsedTokenId);
  }

  @Patch(':tokenId/owners')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token to be transferred',
  })
  @ApiBody({
    type: TokenTransferDto,
    description: 'The address of the new owner of the token',
  })
  public async transferToken(
    @Param('tokenId') tokenId: string,
    @Body() receiverTransferDto: TokenTransferDto,
  ): Promise<TokenReadDto> {
    const parsedTokenId: number = this.parseId(tokenId);
    return this.tokenUpdateService.transferToken(parsedTokenId, receiverTransferDto.newOwnerAddress);
  }

  @Patch(':tokenId')
  @HttpCode(HttpStatus.OK)
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
  public async updateToken(@Param('tokenId') tokenId: string, @Body() dto: TokenUpdateDto): Promise<TokenReadDto> {
    const parsedTokenId = this.parseId(tokenId);
    return this.tokenUpdateService.updateToken(parsedTokenId, dto);
  }

  @Patch(':tokenId/children/:childId/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the token that is the parent of the child to be confirmed',
  })
  @ApiParam({
    name: 'childId',
    type: Number,
    required: true,
    description: 'The id of the child to be confirmed',
  })
  public async confirmChild(@Param('tokenId') tokenId: string, @Param('childId') childId: string): Promise<void> {
    const parsedTokenId = this.parseId(tokenId);
    const parsedChildId = this.parseId(childId);
    return this.tokenUpdateService.confirmChild(parsedTokenId, parsedChildId);
  }

  @Delete(':tokenId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'tokenId',
    type: Number,
    required: true,
    description: 'The id of the Token to be burned',
  })
  public async burnToken(@Param('tokenId') tokenId: string): Promise<void> {
    const parsedTokenId = this.parseId(tokenId);
    return this.tokenBurnService.burnToken(parsedTokenId);
  }

  private parseId(tokenId: string) {
    const parsedId = Number(tokenId);

    if (isNaN(parsedId) || parsedId < 0) {
      throw new BadRequestException('Invalid id provided. It must be a positive integer.');
    }

    return parsedId;
  }

  private validateStatus(status: Status): void {
    if (!Object.values(Status).includes(status)) {
      throw new BadRequestException(
        `Status '${status}' is not supported. Use '${Status.Confirmed}' or '${Status.Unconfirmed}'`,
      );
    }
  }
}
