/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SegmentAllocationService } from '../service/segment-allocation.service';

@Controller()
export class SegmentAllocationAMQPController {
  constructor(private readonly segmentAllocationConnectorService: SegmentAllocationService) {}

  @MessagePattern('getSegmentCountByToken')
  public getSegmentCountByToken(@Payload() queryInput: any) {
    return this.segmentAllocationConnectorService.getSegmentCountByToken(queryInput.tokenId);
  }

  @MessagePattern('getSegmentForTokenAtSegmentIndex')
  public getSegmentForTokenAtSegmentIndex(@Payload() queryInput: any) {
    return this.segmentAllocationConnectorService.getSegmentForTokenAtSegmentIndex(
      queryInput.tokenId,
      queryInput.segmentIndex,
    );
  }

  @MessagePattern('getIndexForTokenAtSegment')
  public getIndexForTokenAtSegment(@Payload() queryInput: any) {
    return this.segmentAllocationConnectorService.getIndexForTokenAtSegment(
      queryInput.tokenId,
      queryInput.segmentAddress,
    );
  }

  @MessagePattern('isTokenInSegment')
  public isTokenInSegment(@Payload() queryInput: any) {
    return this.segmentAllocationConnectorService.isTokenInSegment(queryInput.tokenId, queryInput.segmentAddress);
  }
}
