/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
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

import { TokenCreateService } from '../service/token-create.service';
import { TokenReadService } from '../service/token-read.service';
import { TokenUpdateService } from '../service/token-update.service';
import { TokenDeleteService } from '../service/token-delete.service';
import TokenCreateDto from '../dto/token-create.dto';
import TokenReadDto from '../dto/token-read.dto';
import TokenUpdateDto from '../dto/token-update.dto';
import { SegmentReadDto } from 'src/segment/dto/segment.read.dto';

enum Status {
  Confirmed = 'confirmed',
  Unconfirmed = 'unconfirmed',
}

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
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: TokenCreateDto,
    description: 'Contains all relevant information for the creation of a token',
  })
  @ApiQuery({
    name: 'appendToHierarchy',
    type: Boolean,
    required: true,
    description: 'Whether the token should be appended to a hierarchy or not',
  })
  public async createToken(
    @Body() dto: TokenCreateDto,
    @Query('appendToHierarchy') appendToHierarchy: string,
  ): Promise<TokenReadDto> {
    return this.tokenCreateService.createToken(dto, appendToHierarchy === 'true');
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
  public async deleteToken(@Param('tokenId') tokenId: string): Promise<void> {
    const parsedTokenId = this.parseId(tokenId);
    return this.tokenDeleteService.burnToken(parsedTokenId);
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
