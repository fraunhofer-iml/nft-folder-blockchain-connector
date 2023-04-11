/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContainerService } from '../service/container.service';
import { SegmentDto } from '../../../dto/segment.dto';

@Controller()
export class ContainerAMQPController {
  constructor(private readonly containerConnectorService: ContainerService) {}

  @MessagePattern('createSegment')
  public createSegment(@Payload() queryInput: SegmentDto) {
    return this.containerConnectorService.createSegment(queryInput.name);
  }

  @MessagePattern('getContainerName')
  public getName() {
    return this.containerConnectorService.getName();
  }

  @MessagePattern('getSegmentCount')
  public getSegmentCount() {
    return this.containerConnectorService.getSegmentCount();
  }

  @MessagePattern('getSegmentAtIndex')
  public getSegmentAtIndex(@Payload() queryInput: any) {
    return this.containerConnectorService.getSegmentAtIndex(queryInput.index);
  }

  @MessagePattern('isSegmentInContainer')
  public isSegmentInContainer(@Payload() queryInput: any) {
    return this.containerConnectorService.isSegmentInContainer(queryInput.segment);
  }
}
