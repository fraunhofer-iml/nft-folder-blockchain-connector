import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ContainerModule} from "./modules/container/container.module";
import {ConfigModule} from "@nestjs/config";
import {SegmentModule} from "./modules/segment/segment.module";
import {TokenModule} from "./modules/token/token.module";
import {MigrationsModule} from "./modules/migrations/migrations.module";

@Module({
  imports: [
      ContainerModule,
      SegmentModule,
      TokenModule,
      MigrationsModule,
      ConfigModule.forRoot({
          isGlobal: true,
      })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
