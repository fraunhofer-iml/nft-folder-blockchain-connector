/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DynamicModule, Module } from '@nestjs/common';

import { ConfigurationModule } from 'src/configuration/configuration.module';
import { SharedModule } from '../shared/shared.module';
import { TokenController } from './controller/token.controller';
import { TokenMintService } from './service/token-mint.service';
import { TokenReadService } from './service/token-read.service';
import { TokenUpdateService } from './service/token-update.service';
import { TokenBurnService } from './service/token-burn.service';
import { SegmentService } from '../segment/segment.service';
import { EventService } from './service/event.service';
import { areEndpointsEnabled } from 'src/shared/utils';

@Module({
  imports: [ConfigurationModule, SharedModule],
  providers: [TokenMintService, TokenReadService, TokenUpdateService, TokenBurnService, EventService, SegmentService],
  exports: [TokenMintService, TokenReadService, TokenUpdateService, TokenBurnService],
})
export class TokenModule {
  static getDynamicModule(): DynamicModule {
    return {
      module: TokenModule,
      controllers: areEndpointsEnabled() ? [TokenController] : [],
    };
  }
}
