/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContainerController } from './container.controller';

describe('ContainerController', () => {
  let controller: ContainerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContainerController],
    }).compile();

    controller = module.get<ContainerController>(ContainerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
