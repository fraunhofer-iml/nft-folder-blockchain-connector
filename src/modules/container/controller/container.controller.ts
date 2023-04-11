/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContainerService } from '../service/container.service';
import { map } from 'rxjs';

@ApiTags('NFT Container')
@Controller('container')
export class ContainerController {
  constructor(private readonly containerConnectorService: ContainerService) {}

  @Post('createSegment')
  @ApiQuery({ name: 'nameInput', type: String })
  @ApiOperation({ summary: 'Creates a new segment for the container' })
  public createSegment(@Body() nameInput: any) {
    return this.containerConnectorService.createSegment(nameInput.name).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getName')
  @ApiOperation({ summary: 'Returns the name of the container' })
  public getName() {
    return this.containerConnectorService.getName().pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getSegmentCount')
  @ApiOperation({ summary: 'Returns the number of segments of the container' })
  public getSegmentCount() {
    return this.containerConnectorService.getSegmentCount().pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getSegmentAtIndex/:index')
  @ApiQuery({ name: 'index', type: Number })
  @ApiOperation({ summary: 'Returns the segment at the given index' })
  public getSegmentAtIndex(@Param('index') index: number) {
    return this.containerConnectorService.getSegmentAtIndex(index).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('isSegmentInContainer/:segment')
  @ApiQuery({ name: 'segment', type: String })
  @ApiOperation({ summary: 'Checks if the segment exists in the container' })
  public isSegmentInContainer(@Param('segment') segment: string) {
    return this.containerConnectorService.isSegmentInContainer(segment).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }
}
