import { Module } from '@nestjs/common';
import { MigrationController } from './controller/migration.controller';
import {MigrationsConnectorService} from "./sc-connector/migrations.connector.service";
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";

@Module({
  controllers: [MigrationController],
  providers: [MigrationsConnectorService],
  imports: [BlockchainConnectorModule]
})
export class MigrationsModule {}
