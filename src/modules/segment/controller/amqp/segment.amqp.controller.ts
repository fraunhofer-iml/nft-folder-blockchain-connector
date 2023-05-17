/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import TransactionReceipt from 'web3/types';

import { SegmentService } from '../../service/segment.service';
import { CreateSegmentDto } from '../../../../dto/createSegment.dto';
import { GetSegmentDto } from '../../../../dto/getSegment.dto';

@Controller()
export class SegmentAmqpController {
  constructor(private readonly segmentService: SegmentService) {}

  @MessagePattern('createSegment')
  public createSegment(@Payload() dto: CreateSegmentDto): Observable<TransactionReceipt> {
    return this.segmentService.createSegment(dto.name);
  }

  @MessagePattern('getAllSegmentAddresses')
  public getAllSegments(): Observable<GetSegmentDto[]> {
    return this.segmentService.getAllSegments();
  }

  @MessagePattern('getSegment')
  public getSegment(@Payload() dto: any): Observable<GetSegmentDto> {
    return this.segmentService.getSegment(dto.index);
  }

  @MessagePattern('addToken')
  public addToken(@Payload() dto: any): Observable<TransactionReceipt> {
    return this.segmentService.addToken(dto.index, dto.tokenAddress, dto.tokenId);
  }

  @MessagePattern('removeToken')
  public removeToken(@Payload() dto: any): Observable<TransactionReceipt> {
    return this.segmentService.removeToken(dto.index, dto.tokenAddress, dto.tokenId);
  }
}
