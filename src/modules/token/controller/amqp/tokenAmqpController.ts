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

import { TokenService } from '../../service/token.service';
import { GetTokenDto, MintTokenDto } from '../../../../dto/token.dto';
import { GetSegmentDto } from '../../../../dto/getSegment.dto';

@Controller()
export class TokenAmqpController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('mintToken')
  public mintToken(@Payload() mintTokenDto: MintTokenDto): Observable<TransactionReceipt> {
    return this.tokenService.mintToken(mintTokenDto);
  }

  @MessagePattern('getToken')
  public getToken(@Payload() queryInput: any): Observable<GetTokenDto> {
    return this.tokenService.getToken(queryInput.tokenId);
  }

  @MessagePattern('getSegments')
  public getAllSegments(@Payload() queryInput: any): Observable<GetSegmentDto[]> {
    return this.tokenService.getAllSegments(queryInput.tokenId);
  }

  @MessagePattern('burnToken')
  public burnToken(@Payload() queryInput: any): Observable<TransactionReceipt> {
    return this.tokenService.burnToken(queryInput.tokenId);
  }

  @MessagePattern('transferToken')
  public transferToken(@Payload() queryInput: any): Observable<TransactionReceipt> {
    return this.tokenService.transferToken(queryInput.from, queryInput.to, queryInput.tokenId);
  }
}
