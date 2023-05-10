/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ContainerService } from '../../service/container.service';
import { SegmentDto } from '../../../../dto/segment.dto';
import { handleException } from '../../../utils/errorHandling';

@Controller()
export class ContainerAmqpController {
  constructor(private readonly containerService: ContainerService) {}

  @MessagePattern('createSegment')
  public createSegment(@Payload() dto: SegmentDto) {
    return handleException(this.containerService.createSegment(dto.name));
  }

  @MessagePattern('getName')
  public getName() {
    return handleException(this.containerService.getName());
  }

  @MessagePattern('getSegment')
  public getSegment(@Payload() dto: any) {
    return handleException(this.containerService.getSegment(dto.index));
  }

  @MessagePattern('getNumberOfSegments')
  public getNumberOfSegments() {
    return handleException(this.containerService.getNumberOfSegments());
  }

  @MessagePattern('isSegmentInContainer')
  public isSegmentInContainer(@Payload() dto: any) {
    return handleException(this.containerService.isSegmentInContainer(dto.segment));
  }
}
