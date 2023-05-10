/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { ContainerService } from '../../service/container.service';
import { SegmentDto } from '../../../../dto/segment.dto';
import { handleException } from '../../../utils/errorHandling';

@ApiTags('ContainerRestController')
@Controller('container')
export class ContainerRestController {
  constructor(private readonly containerService: ContainerService) {}

  @Post('createSegment')
  @ApiBody({ description: 'Contains the name of the new segment', type: SegmentDto })
  @ApiOperation({ summary: 'Creates a new segment for the container' })
  public createSegment(@Body() dto: SegmentDto): Observable<any> {
    return handleException(this.containerService.createSegment(dto.name));
  }

  @Get('getName')
  @ApiOperation({ summary: 'Returns the name of the container' })
  public getName() {
    return handleException(this.containerService.getName());
  }

  @Get('getSegment/:index')
  @ApiOperation({ summary: 'Returns the segment' })
  public getSegment(@Param('index') index: number) {
    return handleException(this.containerService.getSegment(index));
  }

  @Get('getNumberOfSegments')
  @ApiOperation({ summary: 'Returns the number of segments of the container' })
  public getNumberOfSegments() {
    return handleException(this.containerService.getNumberOfSegments());
  }

  @Get('isSegmentInContainer/:segment')
  @ApiOperation({ summary: 'Checks if the segment exists in the container' })
  public isSegmentInContainer(@Param('segment') segment: string) {
    return handleException(this.containerService.isSegmentInContainer(segment));
  }
}
