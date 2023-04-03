import { Module } from '@nestjs/common';
import { MigrationController } from './controller/migration.controller';
import {MigrationsConnectorService} from "./sc-connector/migrations.connector.service";
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";
import {ApiConfigService} from "../../settings/ApiConfigService";
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [MigrationController],
  providers: [MigrationsConnectorService, ApiConfigService],
  imports: [
      BlockchainConnectorModule,
      ConfigModule]
})
export class MigrationsModule {}
