/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SegmentService } from '../service/segment.service';
import { TokenDto } from '../../../dto/token.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('NFT Segment')
@Controller('segment')
export class SegmentController {
  constructor(private readonly segmentConnectorService: SegmentService) {}

  @Post('addToken')
  @ApiBody({ type: TokenDto, description: 'Contains the attributes of a token and the segment address' })
  @ApiOperation({ summary: 'Adds a token to a segment' })
  public addToken(@Body() tokenInput: TokenDto) {
    return this.segmentConnectorService
      .addToken(tokenInput.tokenAddress, tokenInput.tokenId, tokenInput.segmentIndex)
      .pipe(
        map((res) => {
          if (res.errorCode) {
            throw new BadRequestException(res.errorMessage);
          }
          return res;
        }),
      );
  }

  @Delete('removeToken')
  @ApiBody({ type: TokenDto, description: 'Contains the attributes of a token and the segment address' })
  @ApiOperation({ summary: 'Removes a token from the segment' })
  public removeToken(@Body() tokenInput: TokenDto) {
    return this.segmentConnectorService
      .removeToken(tokenInput.tokenAddress, tokenInput.tokenId, tokenInput.segmentIndex)
      .pipe(
        map((res) => {
          if (res.errorCode) {
            throw new BadRequestException(res.errorMessage);
          }
          return res;
        }),
      );
  }

  @Get('getName/:segmentAddress')
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the name of the segment' })
  public getName(@Param('segmentAddress') segmentAddress: string) {
    return this.segmentConnectorService.getName(segmentAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getContainer/:segmentAddress')
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the container of the segment' })
  public getContainer(@Param('segmentAddress') segmentAddress: string) {
    return this.segmentConnectorService.getContainer(segmentAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getTokenInformation/:segmentAddress/:index')
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiQuery({ name: 'index', type: Number })
  @ApiOperation({ summary: 'Returns the token information of the segment' })
  public getTokenInformation(@Param('segmentAddress') segmentAddress: string, @Param('index') index: number) {
    return this.segmentConnectorService.getTokenInformation(segmentAddress, index).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getTokenLocationInSegment/:tokenAddress/:tokenId/:segmentAddress')
  @ApiQuery({ name: 'tokenAddress', type: String })
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns the token location within the segment' })
  public getTokenLocationInSegment(
    @Param('tokenAddress') tokenAddress: string,
    @Param('tokenId') tokenId: number,
    @Param('segmentAddress') segmentAddress: string,
  ) {
    return this.segmentConnectorService.getTokenLocationInSegment(tokenAddress, tokenId, segmentAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('isTokenInSegment/:tokenAddress/:tokenId/:segmentAddress')
  @ApiQuery({ name: 'tokenAddress', type: String })
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiQuery({ name: 'segmentAddress', type: String })
  @ApiOperation({ summary: 'Returns if the token is in the segment' })
  public isTokenInSegment(
    @Param('tokenAddress') tokenAddress: string,
    @Param('tokenId') tokenId: number,
    @Param('segmentAddress') segmentAddress: string,
  ) {
    return this.segmentConnectorService.isTokenInSegment(tokenAddress, tokenId, segmentAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }
}
