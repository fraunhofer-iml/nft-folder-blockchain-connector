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
import { TokenGetDto, TokenMintDto } from '../../../../dto/token.dto';
import { GetSegmentDto } from '../../../../dto/getSegment.dto';

@Controller()
export class TokenAmqpController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('mintToken')
  public mintToken(@Payload() dto: TokenMintDto): Observable<TransactionReceipt> {
    return this.tokenService.mintToken(dto);
  }

  @MessagePattern('getToken')
  public getToken(@Payload() queryInput: any): Observable<TokenGetDto> {
    return this.tokenService.getTokenByTokenId(queryInput.tokenId);
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
