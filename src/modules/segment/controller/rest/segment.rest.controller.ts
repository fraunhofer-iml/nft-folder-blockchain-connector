/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { SegmentService } from '../../service/segment.service';
import { TokenDto } from '../../../../dto/token.dto';
import { handleException } from '../../../utils/errorHandling';

@ApiTags('SegmentRestController')
@Controller('segment')
export class SegmentRestController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post('addToken')
  @ApiBody({ type: TokenDto, description: 'Contains the attributes of a token and the segment address' })
  @ApiOperation({ summary: 'Adds a token to a segment' })
  public addToken(@Body() dto: TokenDto) {
    return handleException(this.segmentService.addToken(dto.tokenAddress, dto.tokenId, dto.segmentAddress));
  }

  @Delete('removeToken')
  @ApiBody({ type: TokenDto, description: 'Contains the attributes of a token and the segment address' })
  @ApiOperation({ summary: 'Removes a token from the segment' })
  public removeToken(@Body() dto: TokenDto) {
    return handleException(this.segmentService.removeToken(dto.tokenAddress, dto.tokenId, dto.segmentAddress));
  }

  @Get('getName/:segmentAddress')
  @ApiOperation({ summary: 'Returns the name of the segment' })
  public getName(@Param('segmentAddress') segmentAddress: string) {
    return handleException(this.segmentService.getName(segmentAddress));
  }

  @Get('getContainer/:segmentAddress')
  @ApiParam({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the container of the segment' })
  public getContainer(@Param('segmentAddress') segmentAddress: string) {
    return handleException(this.segmentService.getContainer(segmentAddress));
  }

  @Get('getTokenInformation/:segmentAddress')
  @ApiParam({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the token information of the segment' })
  public getAllTokenInformation(@Param('segmentAddress') segmentAddress: string) {
    return handleException(this.segmentService.getAllTokenInformation(segmentAddress));
  }

  @Get('getTokenInformation/:segmentAddress/:index')
  @ApiParam({ name: 'segmentAddress', type: String })
  @ApiParam({ name: 'index', type: Number })
  @ApiOperation({ summary: 'Returns the token information of the segment' })
  public getTokenInformation(@Param('segmentAddress') segmentAddress: string, @Param('index') index: number) {
    return handleException(this.segmentService.getTokenInformation(segmentAddress, index));
  }

  @Get('getNumberOfTokenInformation/:segmentAddress')
  @ApiParam({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the number of token information of the segment' })
  public getNumberOfTokenInformation(@Param('segmentAddress') segmentAddress: string) {
    return handleException(this.segmentService.getNumberOfTokenInformation(segmentAddress));
  }

  @Get('isTokenInSegment/:tokenAddress/:tokenId/:segmentAddress')
  @ApiParam({ name: 'tokenAddress', type: String })
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiParam({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns if the token is in the segment' })
  public isTokenInSegment(
    @Param('tokenAddress') tokenAddress: string,
    @Param('tokenId') tokenId: number,
    @Param('segmentAddress') segmentAddress: string,
  ) {
    return handleException(this.segmentService.isTokenInSegment(tokenAddress, tokenId, segmentAddress));
  }
}
