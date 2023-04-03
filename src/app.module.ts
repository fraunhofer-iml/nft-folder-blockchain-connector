import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ContainerModule} from "./modules/container/container.module";

@Module({
  imports: [ContainerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
