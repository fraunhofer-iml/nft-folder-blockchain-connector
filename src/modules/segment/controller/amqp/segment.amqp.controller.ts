/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { SegmentService } from '../../service/segment.service';
import { TokenDto } from '../../../../dto/token.dto';
import { handleException } from '../../../utils/errorHandling';

@Controller()
export class SegmentAmqpController {
  constructor(private readonly segmentService: SegmentService) {}

  @MessagePattern('addToken')
  public addToken(@Payload() dto: TokenDto) {
    return handleException(this.segmentService.addToken(dto.tokenAddress, dto.tokenId, dto.segmentAddress));
  }

  @MessagePattern('removeToken')
  public removeToken(@Payload() dto: TokenDto) {
    return handleException(this.segmentService.removeToken(dto.tokenAddress, dto.tokenId, dto.segmentAddress));
  }

  @MessagePattern('getName')
  public getName(@Payload() queryInput: any) {
    return handleException(this.segmentService.getName(queryInput.segmentAddress));
  }

  @MessagePattern('getContainer')
  public getContainer(@Payload() queryInput: any) {
    return handleException(this.segmentService.getContainer(queryInput.segmentAddress));
  }

  @MessagePattern('getTokenInformationList')
  public getAllTokenInformation(@Payload() queryInput: any) {
    return handleException(this.segmentService.getAllTokenInformation(queryInput.segmentAddress));
  }

  @MessagePattern('getTokenInformation')
  public getTokenInformation(@Payload() queryInput: any) {
    return handleException(this.segmentService.getTokenInformation(queryInput.segmentAddress, queryInput.index));
  }

  @MessagePattern('getNumberOfTokenInformation')
  public getNumberOfTokenInformation(@Payload() queryInput: any) {
    return handleException(this.segmentService.getNumberOfTokenInformation(queryInput.segmentAddress));
  }

  @MessagePattern('isTokenInSegment')
  public isTokenInSegment(@Payload() dto: TokenDto) {
    return handleException(this.segmentService.isTokenInSegment(dto.tokenAddress, dto.tokenId, dto.segmentAddress));
  }
}
