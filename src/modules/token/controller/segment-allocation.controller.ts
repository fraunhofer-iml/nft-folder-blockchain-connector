/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { SegmentAllocationService } from '../service/segment-allocation.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('NFT Segment Allocation')
@Controller('segment-allocation')
export class SegmentAllocationController {
  constructor(private readonly segmentAllocationConnectorService: SegmentAllocationService) {}

  @Get('getSegmentCountByToken/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the number of segments for a tokenId' })
  public getSegmentCountByToken(@Param('tokenId') tokenId: number) {
    return this.segmentAllocationConnectorService.getSegmentCountByToken(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getSegmentForTokenAtSegmentIndex/:tokenId/:segmentIndex')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiQuery({ name: 'segmentIndex', type: String })
  @ApiOperation({ summary: 'Returns the segment for a tokenId and segmentIndex' })
  public getSegmentForTokenAtSegmentIndex(
    @Param('tokenId') tokenId: number,
    @Param('segmentIndex') segmentIndex: number,
  ) {
    return this.segmentAllocationConnectorService.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getIndexForTokenAtSegment/:tokenId/:segmentAddress')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the index for a token' })
  public getIndexForTokenAtSegment(@Param('tokenId') tokenId: number, @Param('segmentAddress') segmentAddress: string) {
    return this.segmentAllocationConnectorService.getIndexForTokenAtSegment(tokenId, segmentAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('isTokenInSegment/:tokenId/:segmentAddress')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns if the token is in the segment' })
  public isTokenInSegment(@Param('tokenId') tokenId: number, @Param('segmentAddress') segmentAddress: string) {
    return this.segmentAllocationConnectorService.isTokenInSegment(tokenId, segmentAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }
}
