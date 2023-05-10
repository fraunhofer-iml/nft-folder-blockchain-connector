/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { SegmentAllocationService } from '../../service/segment-allocation.service';
import { handleException } from '../../../utils/errorHandling';

@ApiTags('SegmentAllocationRestController')
@Controller('segment-allocation')
export class SegmentAllocationRestController {
  constructor(private readonly segmentAllocationService: SegmentAllocationService) {}

  @Get('getSegments/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the segment list' })
  public getSegments(@Param('tokenId') tokenId: number) {
    return handleException(this.segmentAllocationService.getSegments(tokenId));
  }

  @Get('getSegment/:tokenId/:segmentAddressIndex')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiParam({ name: 'segmentAddressIndex', type: Number })
  @ApiOperation({ summary: 'Returns the segment' })
  public getSegment(@Param('tokenId') tokenId: number, @Param('segmentAddressIndex') segmentAddressIndex: number) {
    return handleException(this.segmentAllocationService.getSegment(tokenId, segmentAddressIndex));
  }

  @Get('getNumberOfSegments/:tokenId')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the number of segments for a tokenId' })
  public getNumberOfSegments(@Param('tokenId') tokenId: number) {
    return handleException(this.segmentAllocationService.getNumberOfSegments(tokenId));
  }

  @Get('isTokenInSegment/:tokenId/:segmentAddress')
  @ApiParam({ name: 'tokenId', type: Number })
  @ApiParam({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns if the token is in the segment' })
  public isTokenInSegment(@Param('tokenId') tokenId: number, @Param('segmentAddress') segmentAddress: string) {
    return handleException(this.segmentAllocationService.isTokenInSegment(tokenId, segmentAddress));
  }
}
