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

import { SegmentService } from '../service/segment.service';

import { TokenContractInfoDto } from '../../../dto/token.dto';
import { CreateSegmentDto } from '../../../dto/createSegment.dto';
import { GetSegmentDto } from '../../../dto/getSegment.dto';

@Controller('segments')
@ApiTags('SegmentController')
export class SegmentRestController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new segment' })
  @ApiBody({ description: 'Contains the name of the new segment', type: CreateSegmentDto })
  public createSegment(@Body() dto: CreateSegmentDto): Observable<TransactionReceipt> {
    return this.segmentService.createSegment(dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all segments' })
  public getAllSegments(): Observable<GetSegmentDto[]> {
    return this.segmentService.getAllSegments();
  }

  @Get(':index')
  @ApiOperation({ summary: 'Returns the segment at the specified index' })
  @ApiParam({ name: 'index', type: Number })
  public getSegment(@Param('index') index: number): Observable<GetSegmentDto> {
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
