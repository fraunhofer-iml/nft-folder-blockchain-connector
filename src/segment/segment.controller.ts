/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import TransactionReceipt from 'web3/types';

import { SegmentService } from './segment.service';

import { TokenContractInfoDto } from '../token/dto/token.dto';
import { SegmentCreateDto } from './dto/segment.create.dto';
import { SegmentReadDto } from './dto/segment.read.dto';

@Controller('segments')
@ApiTags('SegmentController')
export class SegmentRestController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new segment' })
  @ApiBody({ description: 'Contains the name of the new segment', type: SegmentCreateDto })
  public createSegment(@Body() dto: SegmentCreateDto): Observable<TransactionReceipt> {
    return this.segmentService.createSegment(dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all segments' })
  public getAllSegments(): Observable<SegmentReadDto[]> {
    return this.segmentService.getAllSegments();
  }

  @Get(':index')
  @ApiOperation({ summary: 'Returns the segment at the specified index' })
  @ApiParam({ name: 'index', type: Number })
  public getSegment(@Param('index') index: number): Observable<SegmentReadDto> {
    return this.segmentService.getSegment(index);
  }

  @Patch(':index/add-token')
  @ApiOperation({ summary: 'Adds a token to the segment at the specified index' })
  @ApiParam({ name: 'index', type: String })
  @ApiBody({ type: TokenContractInfoDto, description: 'Contains the address and id of the token' })
  public addToken(@Param('index') index: number, @Body() dto: TokenContractInfoDto): Observable<TransactionReceipt> {
    return this.segmentService.addToken(index, dto.tokenAddress, Number(dto.tokenId));
  }

  @Patch(':index/remove-token')
  @ApiOperation({ summary: 'Removes a token from the segment at the specified index' })
  @ApiParam({ name: 'index', type: String })
  @ApiBody({ type: TokenContractInfoDto, description: 'Contains the address and id of the token' })
  public removeToken(@Param('index') index: number, @Body() dto: TokenContractInfoDto): Observable<TransactionReceipt> {
    return this.segmentService.removeToken(index, dto.tokenAddress, Number(dto.tokenId));
  }
}
