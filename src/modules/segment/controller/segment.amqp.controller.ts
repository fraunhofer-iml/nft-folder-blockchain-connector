/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokenDto } from '../../../dto/token.dto';
import { SegmentService } from '../service/segment.service';

@Controller()
export class SegmentAMQPController {
  constructor(private readonly segmentConnectorService: SegmentService) {}

  @MessagePattern('addToken')
  public addToken(@Payload() tokenInput: TokenDto) {
    return this.segmentConnectorService.addToken(tokenInput.tokenAddress, tokenInput.tokenId, tokenInput.segmentIndex);
  }

  @MessagePattern('removeToken')
  public removeToken(@Payload() tokenInput: TokenDto) {
    return this.segmentConnectorService.removeToken(
      tokenInput.tokenAddress,
      tokenInput.tokenId,
      tokenInput.segmentIndex,
    );
  }

  @MessagePattern('getSegmentName')
  public getName(@Payload() queryInput: any) {
    return this.segmentConnectorService.getName(queryInput.segmentAddress);
  }

  @MessagePattern('getContainer')
  public getContainer(@Payload() queryInput: any) {
    return this.segmentConnectorService.getContainer(queryInput.segmentAddress);
  }

  @MessagePattern('getTokenInformation')
  public getTokenInformation(@Payload() queryInput: any) {
    return this.segmentConnectorService.getTokenInformation(queryInput.segmentAddress, queryInput.index);
  }

  @MessagePattern('getTokenLocationInSegment')
  public getTokenLocationInSegment(@Payload() queryInput: any) {
    return this.segmentConnectorService.getTokenLocationInSegment(
      queryInput.token,
      queryInput.tokenId,
      queryInput.segmentAddress,
    );
  }

  @MessagePattern('isTokenInSegment')
  public isTokenInSegment(@Payload() queryInput: any) {
    return this.segmentConnectorService.isTokenInSegment(
      queryInput.token,
      queryInput.tokenId,
      queryInput.segmentAddress,
    );
  }
}
