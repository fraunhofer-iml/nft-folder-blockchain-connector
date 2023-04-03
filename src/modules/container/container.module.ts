import { Module } from '@nestjs/common';
import { ContainerController } from './container.controller';

@Module({
  controllers: [ContainerController]
})
export class ContainerModule {}
