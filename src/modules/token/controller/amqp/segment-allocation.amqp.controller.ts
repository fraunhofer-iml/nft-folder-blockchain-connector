/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { SegmentAllocationService } from '../../service/segment-allocation.service';
import { handleException } from '../../../utils/errorHandling';

@Controller()
export class SegmentAllocationAmqpController {
  constructor(private readonly segmentAllocationService: SegmentAllocationService) {}

  @MessagePattern('getSegments')
  public getSegments(@Payload() queryInput: any) {
    return handleException(this.segmentAllocationService.getSegments(queryInput.tokenId));
  }

  @MessagePattern('getSegment')
  public getSegment(@Payload() queryInput: any) {
    return handleException(
      this.segmentAllocationService.getSegment(queryInput.tokenId, queryInput.segmentAddressIndex),
    );
  }

  @MessagePattern('getNumberOfSegments')
  public getNumberOfSegments(@Payload() queryInput: any) {
    return handleException(this.segmentAllocationService.getNumberOfSegments(queryInput.tokenId));
  }

  @MessagePattern('isTokenInSegment')
  public isTokenInSegment(@Payload() queryInput: any) {
    return handleException(
      this.segmentAllocationService.isTokenInSegment(queryInput.tokenId, queryInput.segmentAddress),
    );
  }
}
