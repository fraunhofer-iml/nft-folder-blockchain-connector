/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionReceipt } from 'ethers';

import { SegmentService } from './segment.service';
import { SegmentCreateDto } from './dto/segment.create.dto';
import { SegmentReadDto } from './dto/segment.read.dto';
import { TokenInformationDto } from 'src/token/dto/token.information.dto';

@Controller('segments')
@ApiTags('Segments')
export class SegmentController {
  constructor(private readonly service: SegmentService) {}

  @Post()
  @ApiOperation({
    description: 'This endpoint accepts a name and creates a new Segment with this name',
    summary: 'Creates a new Segment',
  })
  @ApiResponse({ status: 201, description: 'The Segment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'The input does not have the correct format.' })
  @ApiBody({ description: 'Contains the name of the new Segment', type: SegmentCreateDto })
  public createSegment(@Body() dto: SegmentCreateDto): Promise<TransactionReceipt> {
    return this.service.createSegment(dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all segments' })
  @ApiOkResponse({
    description: 'The list of all segments that are stored on the blockchain.',
    type: SegmentReadDto,
    isArray: true,
  })
  public getAllSegments(): Promise<SegmentReadDto[]> {
    return this.service.fetchAllSegments();
  }

  @Get(':index')
  @ApiOperation({ summary: 'Returns the segment at the specified index' })
  @ApiOkResponse({
    description: 'The Segment at the specified index',
    type: SegmentReadDto,
    isArray: false,
  })
  @ApiResponse({
    status: 400,
    description: 'The specified index has not the correct format or there is no Segment at the specified index.',
  })
  @ApiParam({ name: 'index', type: Number, description: 'The index of the searched Segment' })
  public getSegment(@Param('index') index: number): Promise<SegmentReadDto> {
    return this.service.fetchSegment(index);
  }

  @Patch(':index/add-token')
  @ApiOperation({ summary: 'Adds a token to the segment at the specified index' })
  @ApiOkResponse({
    description: 'The token was successfully added to the segment',
    isArray: false,
  })
  @ApiResponse({
    status: 400,
    description:
      'The specified index has not the correct format, there is no Segment at the specified index, the token does not exist or the token has already been added to the segment.',
  })
  @ApiParam({ name: 'index', type: String })
  @ApiBody({ type: TokenInformationDto, description: 'Contains the address and id of the token' })
  public addToken(@Param('index') index: number, @Body() dto: TokenInformationDto): Promise<TransactionReceipt> {
    return this.service.addToken(index, dto.tokenAddress, Number(dto.tokenId));
  }

  @Patch(':index/remove-token')
  @ApiOperation({ summary: 'Removes a token from the segment at the specified index' })
  @ApiOkResponse({
    description: 'The token was successfully removed from the segment',
    isArray: false,
  })
  @ApiResponse({
    status: 400,
    description:
      'The specified index has not the correct format, there is no Segment at the specified index, the token does not exist or the token is not part of the segment.',
  })
  @ApiParam({ name: 'index', type: String })
  @ApiBody({ type: TokenInformationDto, description: 'Contains the address and id of the token' })
  public removeToken(@Param('index') index: number, @Body() dto: TokenInformationDto): Promise<TransactionReceipt> {
    return this.service.removeToken(index, dto.tokenAddress, Number(dto.tokenId));
  }
}
